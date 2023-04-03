import { auth, db } from "../../../config/firebaseAdmin";
import verifyRequest from "../../../utils/verifyRequest";

export default async function handleCoins(req, res) {
  const { secret, idToken, data } = req.body;

  if (req.method === "POST") {
    const uid = await verifyRequest(auth, secret, idToken, req, res);
    // If verified request then do the rest
    if (uid) {
      try {
        const response = await db.collection("users").doc(data.id).get();
        const user = response.data();
        // check if admin
        const claims = await auth.verifyIdToken(idToken);
        if (user.role == process.env.ADMIN_KEY && claims.admin) {
          res.status(200).json({ status: "admin" });
        } else {
          //if not admin then decrease amount of coins
          const coins = Number(user.coins.amount) - Number(data.coinsToTake);
          await db
            .collection("users")
            .doc(data.id)
            .update({ coins: { amount: coins, lastUpdate: new Date() } });
          res.status(200).json({ status: "success" });
        }
      } catch (e) {
        res.status(500).send(e);
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
