const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// https://stripe.com/docs/api/products/create?lang=node
// https://stripe.com/docs/api/prices/create

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { secret, mode, data } = req.body;
    let product;
    let price;

    // Check the secret key first
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      switch (mode) {
        case "create":
          product = await stripe.products.create(data);
          res.status(200).json(product);
          break;
        case "update":
          if (data.price) {
            product = await stripe.products.retrieve(data.id);
            const oldPrice = product.default_price;
            //Create new price
            price = await stripe.prices.create(data.price);
            //Add new price to the product and update product data
            product = await stripe.products.update(data.id, {
              ...data.prod,
              default_price: price.id,
            });
            //Archive the old price(there is no way to change the price amount, currency etc.)
            price = await stripe.prices.update(oldPrice, {
              active: false,
            });
          } else {
            product = await stripe.products.update(data.id, data.prod);
          }
          res.status(200).json(product);
          break;
        case "delete":
          // There is no way to delete the product by API, Fuck you Stripe.
          // const deleted = await stripe.products.del(data.prod_id);
          // According to the official approach from the Stripe team:
          // first unset the product price, then archive the price and then archive the product - wtf
          await stripe.products.update(data.prod_id, {
            default_price: "",
            active: false,
          });
          await stripe.prices.update(data.s_id, {
            active: false,
          });
          res.status(200).json({ message: "Successfully archived!" });
          break;
        case "get":
          product = await stripe.products.retrieve(data.prod_id);
          res.status(200).json(product);
          break;
        default:
          res.status(500).end("Case not supported");
          break;
      }
    } catch (err) {
      console.log(err);
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
