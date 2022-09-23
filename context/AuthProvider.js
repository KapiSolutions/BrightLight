import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/firebase";
import { createUserFirestore } from "../firebase/Firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const GoogleProvider = new GoogleAuthProvider();
  const FacebookProvider = new FacebookAuthProvider();
  const TwitterProvider = new TwitterAuthProvider();
  //   GoogleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');
  //   FacebookProvider.addScope("user_birthday");

  function registerUser(email, password, name, age) {
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
      createUserFirestore(res.user.uid, name, "", email, age);
    });
  }
  function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logoutUser() {
    return auth.signOut();
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  function changeEmail(email) {
    return updateEmail(auth.currentUser, email);
  }
  function changePassword(password) {
    return updatePassword(auth.currentUser, password);
  }
  function isAuthenticated() {
    return !!currentUser ? true : false;
  }

  function loginWithGoogle() {
    signInWithPopup(auth, GoogleProvider)
      .then((res) => {
        const uid = res.user.uid;
        const userName = res.user.displayName.split(" ")[0];
        const lastName = res.user.displayName.split(" ")[1];
        const email = res.user.email;
        createUserFirestore(uid, userName, lastName, email, "");
        router.push("/");
        // const credential = GoogleAuthProvider.credentialFromResult(res);
        // const token = credential?.accessToken;
        // const user = res.user;
        // console.log({ credential, token, user });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // console.log({ errorCode, errorMessage, email, credential });
      });
  }

  function loginWithFacebook() {
    signInWithPopup(auth, FacebookProvider)
      .then((res) => {
        const uid = res.user.uid;
        const userName = res.user.displayName.split(" ")[0];
        const lastName = res.user.displayName.split(" ")[1];
        const email = res.user.email;
        createUserFirestore(uid, userName, lastName, email, "");
        router.push("/");
        // const user = res.user;
        // const credential = FacebookAuthProvider.credentialFromResult(rressult);
        // const accessToken = credential.accessToken;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  }

  function loginWithTwitter() {
    signInWithPopup(auth, TwitterProvider)
      .then((res) => {
        const uid = res.user.uid;
        const userName = res.user.displayName.split(" ")[0];
        const lastName = res.user.displayName.split(" ")[1];
        const email = res.user.email;
        createUserFirestore(uid, userName, lastName, email, "");
        router.push("/");

        // const credential = TwitterAuthProvider.credentialFromResult(res);
        // const token = credential.accessToken;
        // const secret = credential.secret;
        const user = res.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = TwitterAuthProvider.credentialFromError(error);
        console.log(error)
      });
  }

  //Menage users login/out states
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    registerUser,
    loginUser,
    loginWithFacebook,
    loginWithGoogle,
    loginWithTwitter,
    logoutUser,
    resetPassword,
    changeEmail,
    changePassword,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export default AuthProvider;
