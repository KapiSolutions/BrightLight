import { auth } from "../../../../config/firebaseAdmin";
import {setCookie} from "cookies-next";

export default async function verifyToken(req, res) {
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

  if (req.method === "POST") {
    try {
      // check the firebase auth token
      await veryfiyToken();
      // Set session expiration to 5 days.
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      const options = { req, res, maxAge: expiresIn, httpOnly: true, secure: true, sameSite: "strict" };
      setCookie("session", sessionCookie, options);

      res.end(JSON.stringify({ status: "success" }));
    } catch (error) {
      console.log("error: ", error);
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
