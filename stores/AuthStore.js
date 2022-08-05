import React, { useContext, useState, useEffect } from 'react'
import create from 'zustand'
// import { persist } from "zustand/middleware"
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, updateEmail, updatePassword } from 'firebase/auth'

export const useAuthStore = create((set) => ({
    currentUser: undefined,
    registerUser: undefined,
    loginUser: undefined,
    logoutUser: undefined,
    resetPassword: undefined,
    changeEmail: undefined,
    changePassword: undefined,
    registerUserFire: (email, password) => set({
        registerUser: createUserWithEmailAndPassword(auth, email, password),
        currentUser: MenageUser(),
    }),
    loginUserFire: async (email, password) => {
        const lu = await signInWithEmailAndPassword(auth, email, password);
        const cu = onAuthStateChanged(auth, (user) => user);
        console.log('Z Login User: ', lu);
        console.log('Z Current User: ', cu);
        set({
            loginUser: lu,
            currentUser: cu,
        })
    },
    logoutUserFire: async () => {
        const lu = await auth.signOut();
        const cu = onAuthStateChanged(auth, (user) => user);
        console.log('Z LogOut User: ', lu);
        console.log('Z Current User: ', cu);
        set({
        logoutUser: lu,
        currentUser: cu,
    })
},
}))

// set({
//     loginUser: signInWithEmailAndPassword(auth, email, password),
//     currentUser: onAuthStateChanged(auth, (user) => {
//         return user
//     })
// })