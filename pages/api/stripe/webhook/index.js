import Stripe from "stripe";
import { buffer } from "micro";
import { updateDocFields } from "../../../../firebase/Firestore";
import { serverTimestamp  } from "firebase/firestore";

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
      // console.log(`💰  Payment received!`);
      updateDocFields("orders", event.data.object.client_reference_id, { paid: true, status: "In realization", timePayment: serverTimestamp() });
    } else {
      // console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }
    //Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
