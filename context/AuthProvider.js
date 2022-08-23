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

const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext)
}

function AuthProvider({ children }) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const GoogleProvider = new GoogleAuthProvider();

    function registerUser(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    function loginUser(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
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
    function isAuthenticated() {
        return !!currentUser ? true : false
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
        changePassword,
        isAuthenticated
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider