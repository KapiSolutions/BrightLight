import { auth, db } from "../../../../config/firebaseAdmin";

export default async function firebaseAdmin(req, res) {
  const { secret, data, mode } = req.body;
  const headers = req.headers;
  console.log(headers)
  // Check the secret key first
  if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
    return res.status(401).end("Invalid token");
  }

  if (req.method === "POST") {
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
          // await db
          //   .collection(data.collection)
          //   .doc("/" + data.insert.id + "/")
          //   .create({
          //     ...data.insert,
          //     timeCreate: data.insert.timeCreate ? new Date(data.insert.timeCreate) : new Date(),
          //   });
          res.status(200).send("Document created!");
        } catch (e) {
          res.status(500).send(e);
        }
        break;
      case "get-doc":
        try {
          const response = await db.collection(data.collection).doc(data.id).get();
          const document = response.data();
          res.status(200).send(document);
        } catch (e) {
          res.status(500).send(e);
        }
        break;

      default:
        break;
    }

    // Get user:
    // const user = await admin.auth().getUser(uid);

    // delete doc
    // db.collection('items').doc(id).delete();

    // query
    // let query = db.collection('items');
    // let response = [];
    // await query.get().then(querySnapshot => {
    //     let docs = querySnapshot.docs;
    //     for (let doc of docs) {
    //         const selectedItem = {
    //             id: doc.id,
    //             item: doc.data().item
    //         };
    //         response.push(selectedItem);
    //     }
    //     return response;
    // });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
