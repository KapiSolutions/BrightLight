import sendEmail from "../../../../utils/emails/sendEmail";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { secret, data } = req.body;
    const stripeCart = data.stripeCart;
    const orderID = data.orderID;

    // Check the secret key first
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (data.sendOrderConfirmEmail) {
      await sendEmail("orderConfirmation", data, data.language);
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: stripeCart,
        mode: "payment",
        success_url: `${req.headers.origin}/${data.language}/payment/success`,
        cancel_url: `${req.headers.origin}/${data.language}/payment/cancel`,
        automatic_tax: { enabled: false },
        // client_reference_id: orderID,
        metadata: { 
          'orderID': orderID,
          'localeLanguage' : data.localeLanguage,
          'localeTimeZone' : data.localeTimeZone
        },
      });
      res.json({ url: session.url, id: session.id }); //redirect to checkout from the client side
    } catch (err) {
      console.log(err);
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
