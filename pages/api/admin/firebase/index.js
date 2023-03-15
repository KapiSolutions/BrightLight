import admin from "firebase-admin";
// https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5

export default async function orderFinishEmail(req, res) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  const { secret, data, mode } = req.body;

  // Check the secret key first
  if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).end("Invalid token");
  }

  if (req.method === "POST") {
    //Initialize app only when not already initialized
    try {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
    const auth = admin.auth();
    const db = admin.firestore();

    // Handle Firebase Api requests
    switch (mode) {
      case "delete-user":
        try {
          await auth.deleteUser(data.uid);
          res.status(200).end("OK");
        } catch (e) {
          res.status(500).send(e);
        }
        break;
      case "create-doc":
        try {
          await db
            .collection(data.collection)
            .doc("/" + data.insert.id + "/")
            .create({...data.insert, timeCreate: data.insert.timeCreate ? new Date(data.insert.timeCreate) : new Date()});
          res.status(200).send("Document created!");
        } catch (e) {
          res.status(500).send(e);
        }
        break;

      default:
        break;
    }

    // Get user:
    // const user = await admin.auth().getUser(uid);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
