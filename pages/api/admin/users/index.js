import admin from "firebase-admin";

export default async function orderFinishEmail(req, res) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  // if (req.method === "POST") {
    // const { secret, data, type } = req.body;

    // Check the secret key first
    // if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    //   return res.status(401).json({ message: "Invalid token" });
    // }

    try {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      // const app = initializeApp();
      const uid = "un1Yp5Ho6jgdka2mhIe8fWMaGM02";

      const user = await admin.auth().getUser(uid)

      // function deleteUser(uid) {
      //   admin.auth().deleteUser(uid)
      //     .catch(function(error) {
      //       console.log("Error deleting user", uid, error);
      //     });
      // }

      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      return res.status(500).end("Error");
    }
  // } else {
  //   res.setHeader("Allow", "POST");
  //   res.status(405).end("Method Not Allowed");
  // }
}

// https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5
