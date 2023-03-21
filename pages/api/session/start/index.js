import { auth } from "../../../../config/firebaseAdmin";
// import { csrf } from "../../../../config/csrf";
import { setCookie } from "cookies-next";

async function verifyToken(req, res) {
  const { secret, idToken } = req.body;

  // Check the secret key first
  if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).end("Unauthorized");
  }

  // Check if token is provided
  if (!idToken) {
    return res.status(400).end("Invalid token");
  }

  if (req.method === "POST") {
    try {
      // Set session expiration to 5 days.
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      const options = { req, res, maxAge: expiresIn, httpOnly: true, secure: true, sameSite: "strict" };
      setCookie("session", sessionCookie, options);
      res.status(200).json({ status: "success" });
    } catch (error) {
      // console.log("error: ", error);
      res.status(401).send("Error creating cookie!");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
export default verifyToken;
// export default csrf(verifyToken);
