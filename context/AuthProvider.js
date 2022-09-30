import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/firebase";
import {
  getUserDataFirestore,
  createUserFirestore,
  deleteDocInCollection,
  updateDocFields,
} from "../firebase/Firestore";
import {
  deleteUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const router = useRouter();
  const [authUserCredential, setAuthUserCredential] = useState(null);
  const [authUserFirestore, setAuthUserFirestore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const GoogleProvider = new GoogleAuthProvider();
  const FacebookProvider = new FacebookAuthProvider();
  const TwitterProvider = new TwitterAuthProvider();
  //   GoogleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');
  //   FacebookProvider.addScope("user_birthday");

  async function registerUser(email, password, name, age) {
    return createUserWithEmailAndPassword(auth, email, password).then(async (res) => {
      setAuthUserFirestore(await createUserFirestore(res.user.uid, name, "", email, age, "emailAndPassword"));
      router.push("/");
      setSuccessMsg("newUser");
    });
  }
  async function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then(async (res) => {
      setAuthUserFirestore(await getUserDataFirestore(res.user.uid));
    });
  }
  function logoutUser() {
    router.push("/");
    return auth.signOut();
  }
  async function deleteAccount() {
    try {
      await deleteDocInCollection("users", authUserCredential.uid);
      await deleteUser(authUserCredential);
      router.push("/");
      setSuccessMsg("deleteUser");
    } catch (err) {
      throw err;
    }
  }
  async function updateProfile(update) {
    try {
      if (update?.email) {
        updateEmail(authUserCredential, update.email);
      }
      await updateDocFields("users", authUserCredential.uid, update);
      setAuthUserFirestore(await getUserDataFirestore(authUserCredential.uid));
      return true;
    } catch (err) {
      throw err;
    }
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  function changePassword(password) {
    return updatePassword(auth.authUserCredential, password);
  }
  function isAuthenticated() {
    return !!authUserCredential ? true : false;
  }
  async function reauthenticateUser(provider, email, password) {
    try {
      if (provider == "emailAndPassword") {
        const credential = EmailAuthProvider.credential(email, password);
        return await reauthenticateWithCredential(authUserCredential, credential);
      } else if (provider == "Google") {
        const res = await signInWithPopup(auth, GoogleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(res);
        return await reauthenticateWithCredential(authUserCredential, credential);
      } else if (provider == "Facebook") {
        const res = await signInWithPopup(auth, FacebookProvider);
        const credential = FacebookAuthProvider.credentialFromResult(res);
        return await reauthenticateWithCredential(authUserCredential, credential);
      } else if (provider == "Twitter") {
        const res = await signInWithPopup(auth, TwitterProvider);
        const credential = TwitterAuthProvider.credentialFromResult(res);
        return await reauthenticateWithCredential(authUserCredential, credential);
      }
    } catch (err) {
      throw err;
    }
  }

  async function loginWithGoogle() {
    try {
      const res = await signInWithPopup(auth, GoogleProvider);
      const uid = res.user.uid;
      const userName = res.user.displayName.split(" ")[0];
      const lastName = res.user.displayName.split(" ")[1];
      const email = res.user.email;
      const userData = await getUserDataFirestore(uid);
      userData && setAuthUserFirestore(userData);
      if (!userData) {
        setAuthUserFirestore(await createUserFirestore(uid, userName, lastName, email, "", "Google"));
        setSuccessMsg("newUser");
      }

      router.push("/");
      // const credential = GoogleAuthProvider.credentialFromResult(res);
      // const token = credential?.accessToken;
      // const user = res.user;
      // console.log({ credential, token, user });
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      const email = err.email;
      const credential = GoogleAuthProvider.credentialFromError(err);
      // console.log({ errorCode, errorMessage, email, credential });
    }
  }

  async function loginWithFacebook() {
    try {
      const res = await signInWithPopup(auth, FacebookProvider);
      const uid = res.user.uid;
      const userName = res.user.displayName.split(" ")[0];
      const lastName = res.user.displayName.split(" ")[1];
      const email = res.user.email;
      const userData = await getUserDataFirestore(uid);
      userData && setAuthUserFirestore(userData);
      if (!userData) {
        setAuthUserFirestore(await createUserFirestore(uid, userName, lastName, email, "", "Facebook"));
        setSuccessMsg("newUser");
      }
      router.push("/");
      // const user = res.user;
      // const credential = FacebookAuthProvider.credentialFromResult(res);
      // const accessToken = credential.accessToken;
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      const email = err.customData.email;
      const credential = FacebookAuthProvider.credentialFromError(err);
    }
  }

  async function loginWithTwitter() {
    try {
      const res = await signInWithPopup(auth, TwitterProvider);
      const uid = res.user.uid;
      const userName = res.user.displayName.split(" ")[0];
      const lastName = res.user.displayName.split(" ")[1];
      const email = res.user.email;
      const userData = await getUserDataFirestore(uid);
      userData && setAuthUserFirestore(userData);
      if (!userData) {
        setAuthUserFirestore(await createUserFirestore(uid, userName, lastName, email, "", "Twitter"));
        setSuccessMsg("newUser");
      }
      router.push("/");
      // const credential = TwitterAuthProvider.credentialFromResult(res);
      // const token = credential.accessToken;
      // const secret = credential.secret;
      // const user = res.user;
      // console.log(user);
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      const email = err.customData.email;
      const credential = TwitterAuthProvider.credentialFromError(err);
    }
  }

  async function updateUserData(user) {
    setAuthUserFirestore(await getUserDataFirestore(user.uid));
  }
  //Menage users login/out states
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUserCredential(user);
      !user && setAuthUserFirestore(null);
      user && !authUserFirestore && updateUserData(user);
      setLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    authUserCredential,
    authUserFirestore,
    registerUser,
    loginUser,
    loginWithFacebook,
    loginWithGoogle,
    loginWithTwitter,
    logoutUser,
    resetPassword,
    changePassword,
    isAuthenticated,
    reauthenticateUser,
    updateProfile,
    deleteAccount,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export default AuthProvider;
