import { db } from "../config/firebase";
import { doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, collection, query, where, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const getUserDataFirestore = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
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

const createOrderFirestore = async (uid, name, age, email, cart, totalPrice, comments) => {
  const orderID = uuidv4().slice(0, 13);
  const docRef = doc(db, "orders", orderID);
  const orderData = {
    id: orderID,
    userID: uid,
    userName: name,
    userAge: age,
    userEmail: email,
    items: cart,
    status: "Waiting for payment",
    paid: false,
    answers: [],
    totalPrice: totalPrice,
    timeCreate: serverTimestamp(),
    userComments: comments,
    //timePayment:
    //timeFinished:
  };
  try {
    await setDoc(docRef, orderData);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (err) {
    console.error("createOrderFirestore Err: ", err);
    throw err;
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
    throw err;
  }
};

const queryByFirestore = async (collName, state, condition, value) => {
  const dbRef = collection(db, collName);
  const q = query(dbRef, where(state, condition, value));
  const querySnapshot = await getDocs(q);
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push(doc.data());
  });
  return docs.length > 0 ? docs : false;
};

export {
  getUserDataFirestore,
  createUserFirestore,
  queryByFirestore,
  deleteDocInCollection,
  updateDocFields,
  createOrderFirestore,
};
