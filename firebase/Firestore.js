import { db } from "../config/firebase";
import { doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, collection, query, where } from "firebase/firestore";

const createDocFirestore = async (collection, docID, data) => {
  const docRef = doc(db, collection, docID);
  try {
    await setDoc(docRef, data);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (err) {
    console.error("createDocFirestore Err: ", err);
    throw err;
  }
};

const createUserFirestore = async (uid, name, lastName, email, age, provider, cart) => {
  const userData = {
    id: uid,
    name: name,
    lastName: lastName,
    age: age,
    email: email,
    role: "user",
    signProvider: provider,
    cart: cart,
  };
  try {
    await setDoc(doc(db, "users", uid), userData);
    return userData;
  } catch (err) {
    console.error("createUserFirestore Err: ", err);
    throw err;
  }
};

const getUserDataFirestore = async (uid, acceptError) => {
  const docRef = doc(db, "users", uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (err) {
    if (acceptError) {
      return null;
    } else {
      console.log("getUserDataFirestore error: ", err);
      throw err;
    }
  }
};

const deleteDocInCollection = async (collection, uid) => {
  try {
    return await deleteDoc(doc(db, collection, uid));
  } catch (err) {
    throw err;
  }
};

const updateDocFields = async (collection, uid, update) => {
  try {
    const docRef = doc(db, collection, uid);
    await updateDoc(docRef, update);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (err) {
    console.error("updateDocFields error: ", err);
    throw err;
  }
};

const getDocsFromCollection = async (collectionName, onlyIds = false) => {
  try {
    const docs = [];
    const querySnapshot = await getDocs(collection(db, collectionName));
    if (onlyIds) {
      querySnapshot.forEach((doc) => {
        docs.push(doc.data().id);
      });
    } else {
      querySnapshot.forEach((doc) => {
        docs.push(doc.data());
      });
    }
    return docs;
  } catch (err) {
    console.error("getDocsFromCollection error: ", err);
    throw err;
  }
};

const getDocById = async (collection, uid) => {
  try {
    const docRef = doc(db, collection, uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (err) {
    console.error("Error during getting document: ", err);
    throw err;
  }
};

const queryByFirestore = async (collName, state, condition, value) => {
  const dbRef = collection(db, collName);
  try {
    const q = query(dbRef, where(state, condition, value));
    const querySnapshot = await getDocs(q);
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    return docs.length > 0 ? docs : false;
  } catch (err) {
    console.error("queryByFirestore error: ", err);
    throw err;
  }
};

const handleLikeBlog = async (action, blogID, userID, userName) => {
  try {
    const docRef = doc(db, "blog", blogID);
    let docSnap = await getDoc(docRef);
    let likes = [...docSnap.data().likes];
    const likeExist = likes.find((like) => like.userID == userID);

    if (action == "update") {
      //Like exist so perform delete
      if (likeExist) {
        const idx = likes.findIndex((like) => like.userID == userID);
        likes.splice(idx, 1);
        await updateDoc(docRef, { likes: likes });
      } else {
        // Like doesn't exist so perform adding action
        const newLike = {
          date: new Date(),
          userID: userID,
          userName: userName,
        };
        likes.push(newLike);
        await updateDoc(docRef, { likes: likes });
        docSnap = await getDoc(docRef); //get updated likes (to receive the same date format)
        likes = [...docSnap.data().likes];
      }
      return [likeExist ? false : true, likes];
    } else {
      //only check if user have already liked a blog post(during initialization of the page)
      return likeExist ? true : false;
    }
  } catch (err) {
    console.error("handleLikeBlog error: ", err);
    throw err;
  }
};

export {
  createDocFirestore,
  getUserDataFirestore,
  createUserFirestore,
  queryByFirestore,
  deleteDocInCollection,
  updateDocFields,
  getDocsFromCollection,
  getDocById,
  handleLikeBlog,
};
