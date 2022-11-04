const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const stripeCart = req.body.stripeCart;
    const orderID = req.body.orderID;
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: stripeCart,
        mode: "payment",
        success_url: `${req.headers.origin}/payment/success`,
        cancel_url: `${req.headers.origin}/payment/cancel`,
        automatic_tax: { enabled: false },
        client_reference_id: orderID
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
