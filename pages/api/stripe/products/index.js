const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// https://stripe.com/docs/api/products/create?lang=node
// https://stripe.com/docs/api/prices/create

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { secret, data, mode } = req.body;
    let product;
    let price;

    // Check the secret key first
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      switch (mode) {
        case "create":
          product = await stripe.products.create({
            name: data.name,
            description: data.description,
            images: data.images,
            default_price_data: {
              unit_amount: data.priceAmount, //price in cents, eg. 2000 means 20$ or 20pln etc.
              currency: data.priceCurrency,
            },
          });
          break;
        case "update":
          product = await stripe.products.retrieve(data.id);

          if (data.priceAmount) {
            const oldPrice = product.default_price;
            //Create new price
            price = await stripe.prices.create({
              unit_amount: data.priceAmount,
              currency: data.priceCurrency,
              product: data.id,
            });
            //Add new price to the product
            product = await stripe.products.update(data.id, {
              name: data.name ? data.name : product.name,
              description: data.description ? data.description : product.description,
              images: data.images ? data.images : product.images,
              default_price: price.id,
            });
            //Archive the old price(there is no way to change the price amount, currency etc.)
            price = await stripe.prices.update(oldPrice, {
              active: false,
            });
          } else {
            product = await stripe.products.update(data.id, {
              name: data.name ? data.name : product.name,
              description: data.description ? data.description : product.description,
              images: data.images ? data.images : product.images,
            });
          }
          break;
        case "get":
          product = await stripe.products.retrieve(data.id);
          break;
        default:
          break;
      }

      console.log(product);

      res.status(200).end("Done");
    } catch (err) {
      console.log(err);
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
