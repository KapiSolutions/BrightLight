import sendEmail from "../../../utils/emails/sendEmail";
import { auth, db } from "../../../config/firebaseAdmin";
import { csrf } from "../../../config/csrf";
import verifyRequest from "../../../utils/verifyRequest";

async function emailHandler(req, res) {
  if (req.method === "POST") {
    const { secret, idToken, data, type } = req.body;

    const adminRoleCheck = async (uid) => {
      const response = await db.collection("users").doc(uid).get();
      const doc = response.data();
      const claims = await auth.verifyIdToken(idToken);
      
      if (doc.role == process.env.ADMIN_KEY && claims.admin) {
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
        try {
          await sendEmail(type, data, data.language);
          return res.status(200).end("OK");
        } catch (error) {
          return res.status(500).end("Error revalidating");
        }
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default csrf(emailHandler);
