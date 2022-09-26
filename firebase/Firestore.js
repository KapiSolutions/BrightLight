import { db } from "../config/firebase";
import { doc, getDoc, getDocs, setDoc, collection, query, where } from "firebase/firestore";

const createUserFirestore = async (uid, name, lastName, email, age) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    //user exists, do nothing
  } else {
    setDoc(doc(db, "users", uid), {
      role: "user",
      email: email,
      name: name,
      lastName: lastName,
      age: age,
    });
  }
};

const queryByFirestore = async (colName, state, condition, value) => {
  const dbRef = collection(db, colName);
  const q = query(dbRef, where(state, condition, value));
  const querySnapshot = await getDocs(q);
  const docs = [];
  querySnapshot.forEach((doc) => {
    const sample = {
      id: doc.id,
      ...doc.data()
    }
    docs.push(sample)
  });

  return docs.length > 0 ? docs : false;
};

export { createUserFirestore, queryByFirestore };
