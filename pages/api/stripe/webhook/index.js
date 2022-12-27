import Stripe from "stripe";
import { buffer } from "micro";
import { updateDocFields } from "../../../../firebase/Firestore";
import { serverTimestamp } from "firebase/firestore";
import sendEmail from "../../../../utils/emails/sendEmail";
import { getFileUrlStorage } from "../../../../firebase/Storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
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
        //Get the payment method from the payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(event.data.object.payment_intent);
        const paymentMethod = paymentIntent.payment_method_types[0];
        //Update the order with payment details
        const data = await updateDocFields("orders", event.data.object.metadata.orderID, {
          paid: true,
          status: "In realization",
          timePayment: serverTimestamp(),
          paymentMethod: paymentMethod,
          paymentID: event.data.object.payment_intent,
        });

        const cartItems = await Promise.all(
          data.items.map(async (_, idx) => ({
            name: data.items[idx].name,
            price: data.items[idx].price,
            image: await getFileUrlStorage("images/cards", data.items[idx].image),
          }))
        );

        const dataEmail = {
          orderID: data.id,
          timeCreate: data.timeCreate.toDate().toLocaleString(localeLanguage, { timeZone: localeTimeZone }),
          userName: data.userName,
          userEmail: data.userEmail,
          totalPrice: data.totalPrice,
          cartItems: cartItems,
          paymentID: event.data.object.payment_intent,
          paymentMethod: data.paymentMethod,
          amountPaid: data.totalPrice,
          timePayment: data.timePayment.toDate().toLocaleString(localeLanguage, { timeZone: localeTimeZone }),
        };
        //Send confirmation email about the succeeded payment
        await sendEmail("paymentConfirmation", dataEmail, "en");
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
