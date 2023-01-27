import sendEmail from "../../../utils/emails/sendEmail";

export default async function orderFinishEmail(req, res) {
  if (req.method === "POST") {
    const { secret, data, type } = req.body;

    // Check the secret key first
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      await sendEmail(type, data, "en");
      return res.status(200).end("OK");
    } catch (error) {
      return res.status(500).end("Error revalidating");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }

  // Tmp data for testing:
  // const data = {
  //   orderID: "asdasd4",
  //   userName: "Kuba",
  //   userEmail: "kuba.kapek@gmail.com",
  //   totalPrice: "21",
  //   items: [
  //     {
  //       name: "Intentions",
  //       image: "https://firebasestorage.googleapis.com/v0/b/brightlight-443b7.appspot.com/o/images%2Fcards%2Flovers.png?alt=media&token=d911cee3-3c3f-439a-a80f-07dc14defbc6",
  //       price: "12",
  //       cards: "1. King 2. Queen 3. Fool",
  //       question: "What lalalala?",
  //       answer: "That nanananana."
  //     },
  //     {
  //       name: "Friendship",
  //       image: "https://firebasestorage.googleapis.com/v0/b/brightlight-443b7.appspot.com/o/images%2Fcards%2Flovers.png?alt=media&token=d911cee3-3c3f-439a-a80f-07dc14defbc6",
  //       price: "9",
  //       cards: "1. King 2. Queen 3. Fool",
  //       question: "What lalalala2?",
  //       answer: "That nanananana2."
  //     }
  //   ]
  // }
}
