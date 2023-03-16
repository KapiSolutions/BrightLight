import { auth, db } from "../../../../config/firebaseAdmin";
import { csrf } from "../../../../config/csrf";
import {setCookie} from "cookies-next";

async function verifyToken(req, res) {
  const { secret, idToken } = req.body;

  // Check the secret key first
  if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).end("Invalid token");
  }

  const veryfiyToken = async () => {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      return uid;
    } catch (error) {
      throw error;
    }
  };

  const adminRoleCheck = async (uid) => {
    const response = await db.collection("users").doc(uid).get();
    const doc = response.data();
    if (doc.role == process.env.ADMIN_KEY) {
      return true;
    } else {
      return false;
    }
  };

  if (req.method === "POST") {
    try {
      // check the firebase auth token
      const uid = await veryfiyToken();
      const admin = await adminRoleCheck(uid);
      // Set session expiration to 5 days.
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      const options = { req, res, maxAge: expiresIn, httpOnly: true, secure: true, sameSite: "strict" };
      setCookie("session", sessionCookie, options);
      res.status(200).json({ admin: admin });
    } catch (error) {
      console.log("error: ", error);
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default csrf(verifyToken);
