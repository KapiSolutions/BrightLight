import admin from "firebase-admin";
// https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5

export default async function orderFinishEmail(req, res) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  if (req.method === "POST") {
    const { secret, data, type } = req.body;

    // Check the secret key first
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).end("Invalid token");
    }

    try {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }

      //* Get user:
      // const user = await admin.auth().getUser(uid);

      // Delete user:
      if (type === "delete") {
        await admin.auth().deleteUser(data.uid);
      }

      return res.status(200).end("OK");
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
