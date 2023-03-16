import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { auth } from "../config/firebase";
import {
  getUserDataFirestore,
  deleteDocInCollection,
  updateDocFields,
  queryByFirestore,
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
import useStateRef from "react-usestateref";

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
  const [tempCart, setTempCart] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isAdmin, setAdmin] = useState(false);
  const GoogleProvider = new GoogleAuthProvider();
  const FacebookProvider = new FacebookAuthProvider();
  const TwitterProvider = new TwitterAuthProvider();
  var [block, setBlock, refBlock] = useStateRef(false);

  const startSession = async (user) => {
    try {
      const idToken = await user.getIdToken(true);
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
      };
      return await axios.post("/api/session/start/", payload);
    } catch (error) {
      console.log(error);
      setErrorMsg("Unauthorized token.");
      logoutUser();
    }
  };
  const destroySession = async (user) => {
    try {
      const idToken = await user.getIdToken(true);
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
      };
      await axios.post("/api/session/destroy/", payload);
      return;
    } catch (error) {
      throw error;
    }
  };
  const createUser = async (user, data) => {
    try {
      const idToken = await user.getIdToken(true);
      const payload = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        idToken: idToken,
        mode: "create-user",
        data: data,
      };
      return await axios.post("/api/admin/firebase/", payload);
    } catch (error) {
      console.log(error);
      setErrorMsg("Unauthorized token.");
      logoutUser();
    }
  };

  // Check if user exists when loging in/registering account with 3rd party providers
  const checkIfExist = async (userId) => {
    try {
      const data = await getUserDataFirestore(userId, true); // true - dont throw error: when registration using third party provider
      return data;
    } catch (error) {
      return null;
    }
  };

  async function registerUser(email, password, name) {
    try {
      setBlock(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await startSession(res.user);
      const data = {
        id: res.user.uid,
        name: name,
        lastName: "",
        age: "",
        email: email,
        signProvider: "emailAndPassword",
        cart: tempCart ? [tempCart] : [],
      };
      const userData = await createUser(res.user, data);
      setAuthUserFirestore(userData);
      tempCart && setTempCart(null);
      setBlock(false);
      router.push("/");
      setSuccessMsg("newUser");
      return;
    } catch (error) {
      setBlock(false);
      console.log(error);
      throw error;
    }
  }
  async function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then(async (res) => {
      if (tempCart) {
        //when user add something to the cart before logging in
        const userData = await getUserDataFirestore(res.user.uid);
        userData.cart.push(tempCart);
        await updateDocFields("users", res.user.uid, { cart: user.cart });
        setTempCart(null);
      }
      updateUserData(res.user.uid, null);
    });
  }
  const logoutUser = async () => {
    try {
      await destroySession(authUserCredential);
      auth.signOut();
      router.push("/");
      return;
    } catch (error) {
      console.log(error);
      setErrorMsg("Unauthorized token.");
    }
  };
  async function deleteAccount() {
    try {
      await deleteDocInCollection("users", authUserCredential.uid);
      await destroySession(authUserCredential);
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
        await updateEmail(authUserCredential, update.email);
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
      setBlock(true);
      const res = await signInWithPopup(auth, GoogleProvider);
      const uid = res.user.uid;
      const userName = res.user.displayName.split(" ")[0];
      const lastName = res.user.displayName.split(" ")[1];
      const email = res.user.email;
      const userData = await checkIfExist(uid);

      if (userData) {
        if (tempCart) {
          //when user exists and he added something to the cart before logging in
          userData.cart.push(tempCart);
          await updateDocFields("users", uid, { cart: userData.cart });
        }
        updateUserData(uid, userData, false);
      } else {
        //user doesn't exist -> create new account
        await startSession(res.user);
        const data = {
          id: uid,
          name: userName,
          lastName: lastName,
          age: "",
          email: email,
          signProvider: "Google",
          cart: tempCart ? [tempCart] : [],
        };
        const getData = await createUser(res.user, data);
        setAuthUserFirestore(getData);
        setSuccessMsg("newUser");
      }
      tempCart && setTempCart(null);
      router.push("/");
      // const credential = GoogleAuthProvider.credentialFromResult(res);
      // const token = credential?.accessToken;
    } catch (err) {
      // const errorCode = err.code;
      const errorMessage = err.message;
      // const email = err.email;
      // const credential = GoogleAuthProvider.credentialFromError(err);
      router.push("/");
      setErrorMsg(errorMessage);
    }
    setBlock(false);
  }

  async function loginWithFacebook() {
    try {
      setBlock(true);
      const res = await signInWithPopup(auth, FacebookProvider);
      const uid = res.user.uid;
      const userName = res.user.displayName.split(" ")[0];
      const lastName = res.user.displayName.split(" ")[1];
      const email = res.user.email;
      const userData = await checkIfExist(uid);

      if (userData) {
        if (tempCart) {
          userData.cart.push(tempCart);
          await updateDocFields("users", uid, { cart: userData.cart });
        }
        updateUserData(uid, userData, false);
      } else {
        await startSession(res.user);
        const data = {
          id: uid,
          name: userName,
          lastName: lastName,
          age: "",
          email: email,
          signProvider: "Facebook",
          cart: tempCart ? [tempCart] : [],
        };
        const getData = await createUser(res.user, data);
        setAuthUserFirestore(getData);
        setSuccessMsg("newUser");
      }
      tempCart && setTempCart(null);
      router.push("/");
      // const credential = FacebookAuthProvider.credentialFromResult(res);
      // const accessToken = credential.accessToken;
    } catch (err) {
      // const errorCode = err.code;
      const errorMessage = err.message;
      // const email = err.customData.email;
      // const credential = FacebookAuthProvider.credentialFromError(err);
      router.push("/");
      setErrorMsg(errorMessage);
    }
    setBlock(false);
  }

  async function loginWithTwitter() {
    try {
      setBlock(true);
      const res = await signInWithPopup(auth, TwitterProvider);
      const uid = res.user.uid;
      const userName = res.user.displayName.split(" ")[0];
      const lastName = res.user.displayName.split(" ")[1];
      const email = res.user.email;
      const userData = await checkIfExist(uid);

      if (userData) {
        if (tempCart) {
          userData.cart.push(tempCart);
          await updateDocFields("users", uid, { cart: userData.cart });
        }
        updateUserData(uid, userData, false);
      } else {
        await startSession(res.user);
        const data = {
          id: uid,
          name: userName,
          lastName: lastName,
          age: "",
          email: email,
          signProvider: "Twitter",
          cart: tempCart ? [tempCart] : [],
        };
        const getData = await createUser(res.user, data);
        setAuthUserFirestore(getData);
        setSuccessMsg("newUser");
      }
      tempCart && setTempCart(null);
      router.push("/");
      // const credential = TwitterAuthProvider.credentialFromResult(res);
      // const token = credential.accessToken;
      // const secret = credential.secret;
    } catch (err) {
      // const errorCode = err.code;
      const errorMessage = err.message;
      // const email = err.customData.email;
      // const credential = TwitterAuthProvider.credentialFromError(err);
      router.push("/");
      setErrorMsg(errorMessage);
    }
    setBlock(false);
  }

  async function updateUserData(uid, userData, onlyOrders) {
    if (!onlyOrders) {
      if (userData) {
        setAuthUserFirestore(userData);
      } else {
        setAuthUserFirestore(await getUserDataFirestore(uid));
      }
    }
    const orders = await queryByFirestore("orders", "userID", "==", uid);
    orders.length > 0 ? setUserOrders(orders) : setUserOrders([]);
  }
  function clearUserData() {
    setAuthUserFirestore(null);
    setUserOrders([]);
    setAdmin(false);
  }

  //Menage users login/out states
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUserCredential(user);
      if (user) {
        // create session cookie and check admin role
        const res = await startSession(user);
        setAdmin(false);
        res?.data?.admin && setAdmin(true);

        if (!authUserFirestore && !refBlock.current) {
          await updateUserData(user.uid, null, false); //after logging in load all the user data, but block it just after registration
        }
      } else {
        clearUserData(); //after logging out clear all the user data
      }
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
    updateUserData,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    setTempCart,
    userOrders,
    setUserOrders,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export default AuthProvider;
