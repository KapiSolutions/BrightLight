import sendEmail from "../../../utils/emails/sendEmail";

export default async function orderFinishEmail(req, res) {
  if (req.method === "POST") {
    const { secret, data, type } = req.body;

    // Check the secret key first
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      await sendEmail(type, data, data.language);
      return res.status(200).end("OK");
    } catch (error) {
      return res.status(500).end("Error revalidating");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
