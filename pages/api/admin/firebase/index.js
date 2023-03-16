import { auth, db } from "../../../../config/firebaseAdmin";
import { csrf } from "../../../../config/csrf";
import verifyRequest from "../../../../utils/verifyRequest";

async function firebaseAdmin(req, res) {
  const { secret, idToken, data, mode } = req.body;
  // console.log(req.headers)

  const adminRoleCheck = async (uid) => {
    const response = await db.collection("users").doc(uid).get();
    const doc = response.data();
    if (doc.role == process.env.NEXT_PUBLIC_ADMIN_KEY) {
      return true;
    } else {
      return false;
    }
  };

  if (req.method === "POST") {
    const uid = await verifyRequest(auth, secret, idToken, req, res);
    // If verified request then do the rest
    if (uid) {
      const admin = await adminRoleCheck(uid);
      switch (mode) {
        case "delete-user":
          try {
            if (admin) {
              // only Admin can delete users by this method
              await auth.deleteUser(data.uid);
              res.status(200).end("OK");
            } else {
              res.status(403).send("Frobidden!");
            }
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
            // res.status(200).send("Document created!");
            console.log("Yeah")
            res.status(200).json({ admin: admin });
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
        case "admin-check":
          res.status(200).json({ admin: admin });
          break;

        default:
          break;
      }
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

export default csrf(firebaseAdmin);
