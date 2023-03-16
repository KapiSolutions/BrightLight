import { auth, db } from "../../../config/firebaseAdmin";
import { csrf } from "../../../config/csrf";
import verifyRequest from "../../../utils/verifyRequest";

async function revalidate(req, res) {
  if (req.method === "POST") {
    const { secret, idToken, paths } = req.body;

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
        try {
          // path should be the actual path not a rewritten path
          // e.g. for "/blog/[slug]" this should be "/blog/post-1"
          await Promise.all(
            paths.map(async (path) => {
              await res.revalidate(path);
              await res.revalidate("/pl" + path);
              await res.revalidate("/en" + path);
            })
          );

          return res.status(200).json({ revalidated: true });
        } catch (error) {
          console.log(error);
          return res.status(500).end("Error revalidating");
        }
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default csrf(revalidate);
