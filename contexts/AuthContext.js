"use client";

import { db, auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userEntriesObj, setUserEntriesObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  // Auth handlers
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setUserEntriesObj(null);
    setUser(null);
    return signOut(auth);
  }

  // Function to send a password reset email
  function sendPasswordReset(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // Set the user to local context state
        setLoading(true);
        setUser(user);
        if (!user) {
          return;
        }

        // if user exists, fetch data from firebase database
        console.log("Fetching User Data");
        const entriesCollectionRef = collection(
          db,
          "users",
          user.uid,
          "journalEntries"
        );
        const entriesSnap = await getDocs(entriesCollectionRef);

        const firebaseData = {};
        entriesSnap.forEach((doc) => {
          firebaseData[doc.id] = doc.data(); // Collect entries with their document ID (date) as key
        });

        setUserEntriesObj(firebaseData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    userEntriesObj,
    setUserEntriesObj,
    loading,
    signup,
    login,
    logout,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
