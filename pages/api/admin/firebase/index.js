import { auth, db } from "../../../../config/firebaseAdmin";
import { csrf } from "../../../../config/csrf";
import verifyRequest from "../../../../utils/verifyRequest";

async function firebaseAdmin(req, res) {
  const { secret, idToken, data, mode } = req.body;

  const adminRoleCheck = async (uid) => {
    const response = await db.collection("users").doc(uid).get();
    const doc = response.data();
    const claims = await auth.verifyIdToken(idToken);

    if (doc.role == process.env.ADMIN_KEY && claims.admin) {
      return true;
    } else {
      return false;
    }
  };

  //! not used
  // const listAllUsers = async (nextPageToken) => {
  //   const users = [];
  //   // List batch of users, 1000 at a time.
  //   try {
  //     const listUsersResult = await auth.listUsers(1000, nextPageToken);
  //     listUsersResult.users.map((user) => {
  //       users.push(user.toJSON());
  //     });
  //     return users;
  //   } catch (error) {
  //     console.log("Error listing users:", error);
  //   }
  // };

  if (req.method === "POST") {
    const uid = await verifyRequest(auth, secret, idToken, req, res);
    // If verified request then do the rest
    if (uid) {
      switch (mode) {
        case "delete-user":
          try {
            const admin = await adminRoleCheck(uid);
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
        case "create-user":
          try {
            await db
              .collection("users")
              .doc("/" + data.id + "/")
              .create({ ...data, role: "user", timeCreate: new Date(), coins: { amount: 5, lastUpdate: new Date() } });
            const response = await db.collection("users").doc(data.id).get();
            const document = response.data();
            res.status(200).json(document);
          } catch (e) {
            res.status(500).send(e);
          }
          break;
        case "create-order":
          try {
            await db
              .collection("orders")
              .doc("/" + data.id + "/")
              .create({
                ...data,
                timeCreate: data.timeCreate ? new Date(data.timeCreate) : new Date(),
              });
            res.status(200).send("Order created!");
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
        case "set-admin":
          try {
            await auth.setCustomUserClaims(data.id, { admin: true });
            await db.collection("users").doc(data.id).update({ role: process.env.ADMIN_KEY });
            res.status(200).json({ status: "success" });
          } catch (e) {
            res.status(500).send(e);
          }
          break;
        case "remove-admin":
          try {
            await auth.setCustomUserClaims(data.id, null);
            await db.collection("users").doc(data.id).update({ role: "user" });
            res.status(200).json({ status: "success" });
          } catch (e) {
            res.status(500).send(e);
          }
          break;
        // case "get-users": //!not used
        //   const users = await listAllUsers();
        //   res.status(200).json({ users });
        //   break;
        default:
          res.status(405).end("Method Not Allowed");
          break;
      }
    }
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
