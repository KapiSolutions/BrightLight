import sendEmail from "../../../../utils/emails/sendEmail";
import { csrf } from "../../../../config/csrf";
import { auth } from "../../../../config/firebaseAdmin";
import verifyRequest from "../../../../utils/verifyRequest";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function checkoutHandler(req, res) {
  if (req.method === "POST") {
    const { secret, idToken, data, metadata, redirects } = req.body;

    const uid = await verifyRequest(auth, secret, idToken, req, res);
    // If verified request then do the rest
    if (uid) {
      if (data.sendOrderConfirmEmail) {
        await sendEmail("orderConfirmation", data, data.language);
      }
      try {
        const session = await stripe.checkout.sessions.create({
          line_items: data.stripeCart,
          mode: "payment",
          success_url: `${req.headers.origin}/${data.language}/${redirects.success}`,
          cancel_url: `${req.headers.origin}/${data.language}/${redirects.cancel}`,
          automatic_tax: { enabled: false },
          // client_reference_id: orderID,
          metadata: metadata,
        });
        res.status(200).json({ url: session.url, id: session.id }); //redirect to checkout from the client side
      } catch (err) {
        console.log(err);
        res.status(err.statusCode || 500).json(err.message);
      }
    } else {
      res.status(401).end("Unauthorized request");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default csrf(checkoutHandler);
