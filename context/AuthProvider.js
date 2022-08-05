import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../config/firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import Cookies from 'js-cookie'


const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext)
}

function AuthProvider({ children }) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const GoogleProvider = new GoogleAuthProvider();
    //Register new users to firebase account manager
    function registerUser(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    //Log in existing users
    function loginUser(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    //Log out users
    function logoutUser() {
        return auth.signOut()
    }
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }
    function changeEmail(email) {
        return updateEmail(auth.currentUser, email)
    }
    function changePassword(password) {
        return updatePassword(auth.currentUser, password)
    }

    function loginWithGoogle() {
        signInWithPopup(auth, GoogleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                // console.log({ credential, token, user });
                router.push('/');
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // console.log({ errorCode, errorMessage, email, credential });
            });
    };

    //Menage users login/out states
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
            user ? Cookies.set('userLoggedIn', true, { SameSite: "Lax", Secure: "false" }) : Cookies.remove('userLoggedIn')
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        registerUser,
        loginUser,
        loginWithGoogle,
        logoutUser,
        resetPassword,
        changeEmail,
        changePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider