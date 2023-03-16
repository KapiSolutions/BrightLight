const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { auth } from "../../../../config/firebaseAdmin";
import { csrf } from "../../../../config/csrf";
// https://stripe.com/docs/api/products/create?lang=node
// https://stripe.com/docs/api/prices/create

async function productsHandler(req, res) {
  if (req.method === "POST") {
    const { secret, idToken, mode, data } = req.body;
    let product;
    let price;

    const adminRoleCheck = async (uid) => {
      const response = await db.collection("users").doc(uid).get();
      const doc = response.data();
      if (doc.role == process.env.ADMIN_KEY) {
        return true;
      } else {
        return false;
      }
    };

    const uid = await verifyRequest(auth, secret, idToken, req, res);
    // If verified request then check if admin
    if (uid) {
      const admin = await adminRoleCheck(uid);
      if (admin) {
        // Do the job:
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
                //? Dont archive the old price (to leave the old price in the user cart after changing the default product price.)
                // price = await stripe.prices.update(oldPrice, {
                //   active: false,
                // });
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
          res.status(err.status || 500).json(err.message);
        }
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default csrf(productsHandler);
