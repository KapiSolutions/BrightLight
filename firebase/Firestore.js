import { db } from "../config/firebase";
import { doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, collection, query, where } from "firebase/firestore";

const getUserDataFirestore = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: uid, ...docSnap.data() };
  } else {
    return null;
  }
};

const createUserFirestore = async (uid, name, lastName, email, age, provider, cart) => {
  const userData = {
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
    console.error('createUserFirestore Err: ',err);
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
    return await updateDoc(docRef, update);
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
    const sample = {
      id: doc.id,
      ...doc.data(),
    };
    docs.push(sample);
  });
  return docs.length > 0 ? docs : false;
};

export { getUserDataFirestore, createUserFirestore, queryByFirestore, deleteDocInCollection, updateDocFields };
