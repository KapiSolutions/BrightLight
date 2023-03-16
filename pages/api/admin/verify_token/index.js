import { auth } from "../../../../config/firebaseAdmin";

export default async function verifyToken(req, res) {
  const { secret, idToken } = req.body;
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  const headers = req.headers;
  console.log(headers);
  // Check the secret key first
  if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).end("Invalid token");
  }

  if (req.method === "POST") {
    try {
      // check the firebase auth token
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken;
      console.log("uid: ", uid);
      // Set the session cookie and cookie policy.
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      const options = { maxAge: expiresIn, httpOnly: true, secure: true };
      res.cookies("session", sessionCookie, options);
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
