import { deleteCookie } from "cookies-next";

export default async function verifyToken(req, res) {
  const { secret } = req.body;

  // Check the secret key first
  if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).end("Invalid token");
  }

  if (req.method === "POST") {
    try {
      deleteCookie("session", { req, res });
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
