import Stripe from "stripe";
import { buffer } from "micro";
import sendEmail from "../../../../utils/emails/sendEmail";
import { db } from "../../../../config/firebaseAdmin";
import { getFileUrlStorage } from "../../../../firebase/Storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const handleOrder = async (orderID, paymentIntent, payMethod, localeLanguage, localeTimeZone) => {
  try {
    //Update the order with payment details
    await db.collection("orders").doc(orderID).update({
      paid: true,
      status: "In realization",
      timePayment: new Date(),
      paymentMethod: payMethod,
      paymentID: paymentIntent,
    });

    // Get all details of the order
    const response = await db.collection("orders").doc(orderID).get();
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
      timeCreate: data.timeCreate.toDate().toLocaleString(localeLanguage, { timeZone: localeTimeZone }),
      userName: data.userName,
      userEmail: data.userEmail,
      totalPrice: data.totalPrice,
      currency: data.currency,
      cartItems: cartItems,
      paymentID: paymentIntent,
      paymentMethod: data.paymentMethod,
      amountPaid: data.totalPrice,
      language: data.language,
      timePayment: data.timePayment.toDate().toLocaleString(localeLanguage, { timeZone: localeTimeZone }),
    };
    //Send confirmation email about the succeeded payment
    await sendEmail("paymentConfirmation", dataEmail, data.language);
    return;
  } catch (error) {
    throw error;
  }
};

const handleCoins = async (userID, coinsToAdd, coinsAlreadyHave) => {
  try {
    //Update user data
    await db
      .collection("users")
      .doc(userID)
      .update({
        coins: {
          amount: Number(coinsToAdd) + Number(coinsAlreadyHave),
          lastUpdate: new Date(),
        },
      });
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
        const localeLanguage = event.data.object.metadata.localeLanguage; //Client's locale language
        const localeTimeZone = event.data.object.metadata.localeTimeZone; //Client's locale time zone
        const coinsPayment = event.data.object.metadata.coinsBuy;
        //Get the payment method from the payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(event.data.object.payment_intent);
        const paymentMethod = paymentIntent.payment_method_types[0];

        if (coinsPayment) {//handle coins payment
          const coinsToAdd = event.data.object.metadata.coinsToAdd;
          const coinsAlreadyHave = event.data.object.metadata.coinsAlreadyHave;
          await handleCoins(
            event.data.object.metadata.userID,
            coinsToAdd,
            coinsAlreadyHave,
            event.data.object.payment_intent,
            paymentMethod,
            localeLanguage,
            localeTimeZone
          );
        } else {//handle tarot payment
          await handleOrder(
            event.data.object.metadata.orderID,
            event.data.object.payment_intent,
            paymentMethod,
            localeLanguage,
            localeTimeZone
          );
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
