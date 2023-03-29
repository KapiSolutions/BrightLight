import Stripe from "stripe";
import { buffer } from "micro";
import sendEmail from "../../../../utils/emails/sendEmail";
import { db } from "../../../../config/firebaseAdmin";
import { getFileUrlStorage } from "../../../../firebase/Storage";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const handleOrder = async (metadata, paymentIntent, payMethod) => {
  try {
    //Update the order with payment details
    await db.collection("orders").doc(metadata.orderID).update({
      paid: true,
      status: "In realization",
      timePayment: new Date(),
      paymentMethod: payMethod,
      paymentID: paymentIntent,
    });

    // Get all details of the order
    const response = await db.collection("orders").doc(metadata.orderID).get();
    const data = response.data();

    // Prepare order items for the email confirmation
    const cartItems = await Promise.all(
      data.items.map(async (item) => ({
        name: item.name[data.language],
        price: item.price[data.currency].amount,
        currency: data.currency,
        image: await getFileUrlStorage(`images/products/${item.product_id}`, item.image.name),
      }))
    );

    const dataEmail = {
      orderID: data.id,
      timeCreate: data.timeCreate
        .toDate()
        .toLocaleString(metadata.localeLanguage, { timeZone: metadata.localeTimeZone }),
      userName: data.userName,
      userEmail: data.userEmail,
      userID: data.userID,
      totalPrice: data.totalPrice,
      currency: data.currency,
      cartItems: cartItems,
      paymentID: paymentIntent,
      paymentMethod: data.paymentMethod,
      amountPaid: data.totalPrice,
      language: data.language,
      timePayment: data.timePayment
        .toDate()
        .toLocaleString(metadata.localeLanguage, { timeZone: metadata.localeTimeZone }),
    };
    //Send confirmation email about the succeeded payment
    await sendEmail("paymentConfirmation", dataEmail, data.language);
    //Send notification to the admin
    await sendEmail("pushNotificationAdmin", dataEmail, "pl");
    return;
  } catch (error) {
    throw error;
  }
};

const handleCoins = async (metadata, paymentIntent, payMethod) => {
  try {
    const date = new Date();
    const id = uuidv4().slice(0, 13);
    //Update user data
    await db
      .collection("users")
      .doc(metadata.userID)
      .update({
        coins: {
          amount: Number(metadata.coinsToAdd) + Number(metadata.coinsAlreadyHave),
          lastUpdate: date,
        },
      });
    // Create payment details object in the firestore
    await db
      .collection("coinsPayments")
      .doc("/" + id + "/")
      .create({
        id: id,
        userID: metadata.userID,
        coinsAdded: Number(metadata.coinsToAdd),
        totalPrice: metadata.totalPrice,
        currency: metadata.currency,
        paymentMethod: payMethod,
        paymentID: paymentIntent,
        timeCreate: date,
      });
    // Get all the necessary user data
    const response = await db.collection("users").doc(metadata.userID).get();
    const user = response.data();

    const dataEmail = {
      orderID: id,
      userName: user.name,
      userEmail: user.email,
      currency: metadata.currency,
      unitPrice: Number(metadata.unitPrice),
      totalPrice: metadata.totalPrice,
      coin: metadata.coin,
      coinsToAdd: metadata.coinsToAdd,
      paymentID: paymentIntent,
      paymentMethod: payMethod,
      amountPaid: metadata.totalPrice,
      language: metadata.localeLanguage,
      timePayment: date.toLocaleString(metadata.localeLanguage, { timeZone: metadata.localeTimeZone }),
    };
    //Send confirmation email about the succeeded payment
    await sendEmail("coinPaymentConfirmation", dataEmail, metadata.localeLanguage);
    return;
  } catch (error) {
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    let event;
    try {
      //Retrieve the event by verifying the signature using the raw body and secret
      const rawBody = await buffer(req);
      const signature = req.headers["stripe-signature"];
      event = stripe.webhooks.constructEvent(rawBody.toString(), signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    // console.log("✅ Success:", event.id);

    // Payment successful
    if (event.type === "checkout.session.completed") {
      // console.log("💰  Payment received!: ", event.data.object);
      try {
        //Get the client's locale information for the proper date conversion in the email notification
        const metadata = event.data.object.metadata;
        const coinsPayment = event.data.object.metadata.coinsBuy;
        //Get the payment method from the payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(event.data.object.payment_intent);
        const paymentMethod = paymentIntent.payment_method_types[0];

        if (coinsPayment) {
          //handle coins payment
          await handleCoins(metadata, event.data.object.payment_intent, paymentMethod);
        } else {
          //handle tarot payment
          await handleOrder(metadata, event.data.object.payment_intent, paymentMethod);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      // console.log("🤷‍♀️ Unhandled event data: ", event.data.object);
    }
    //Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
