import sendEmail from "../../../../utils/emails/sendEmail";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = { ...req.body };
    const stripeCart = data.stripeCart;
    const orderID = data.orderID;

    if (data.sendOrderConfirmEmail) {
      await sendEmail("orderConfirmation", data, "en");
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: stripeCart,
        mode: "payment",
        success_url: `${req.headers.origin}/payment/success`,
        cancel_url: `${req.headers.origin}/payment/cancel`,
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
