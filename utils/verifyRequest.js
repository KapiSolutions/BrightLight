import { getCookie } from "cookies-next";

export default async function verifyRequest(auth, secret, idToken, req, res) {
  try {
    // Check secret key
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).send("UNAUTHORIZED REQUEST!");
    }

    // Check user idToken
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check sessionCookie
    const sessionCookie = getCookie("session", { req, res }) || "";
    if (!sessionCookie) {
      return res.status(401).send("UNAUTHORIZED REQUEST!");
    }

    // Decode the cookie and compare with decoded idToken
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const authorized = uid == decodedClaims.uid;

    if (authorized) {
      return uid;
    } else {
      return res.status(401).send("UNAUTHORIZED REQUEST!");
    }
  } catch (error) {
    return res.status(401).send("UNAUTHORIZED REQUEST!");
  }
}
