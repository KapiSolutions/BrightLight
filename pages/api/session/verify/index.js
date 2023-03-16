import { auth } from "../../../../config/firebaseAdmin";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

export default async function verifyToken(req, res) {
  const { secret, idToken } = req.body;
  const headers = req.headers;

  // Check the secret key first
  if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).end("Invalid token");
  }

  // FUNCTIONS
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
      const uid = await veryfiyToken();
      // Check sessionCookie
      const sessionCookie = getCookie("session", { req, res }) || "";
      if (!sessionCookie) {
        res.status(401).send("UNAUTHORIZED REQUEST!");
        return;
      }
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      const authorized = uid == decodedClaims.uid;

      authorized && res.status(200).end(JSON.stringify({ status: "success" }));
      !authorized && res.status(401).send("UNAUTHORIZED REQUEST!");
    } catch (error) {
      // console.log("error: ", error);
      res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
