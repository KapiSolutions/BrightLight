import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

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


export {createUserFirestore}