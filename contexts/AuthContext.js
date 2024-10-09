"use client";

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // Set the user to local context state
        setLoading(true);
        setUser(user);
        if (!user) {
          console.log("No User Found");
          return;
        }
      } catch (error) {
        console.error("Error during auth state change:", error.message);
      } finally {
        setLoading(false); // no longer loading once we know the auth state
      }
    });
    return () => unsubscribe();
  }, []);

  // Auth handlers
  const signup = async (email, password) => {
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Signup failed", error.message, error.code)
      throw new Error(handleFirebaseAuthError(error)) // handle specific firebase errors
    } finally {
      setLoading(false)
    }
   }

   const signin = async (email, password) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Failed to sign in: ", error.message, error.code)
      const friendlyMessage = handleFirebaseAuthError(error)
      throw new Error(friendlyMessage)
    } finally {
      setLoading(false)
    }
   }

   const signout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Signout Failed", error.message, error.code)
    } finally {
      setLoading(false)
    }
   }

  const value = {
    user,
    loading,
    signup,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Utility function to map Firebase errors to user-friendly messages
function handleFirebaseAuthError(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address. Please check the format.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with these credentials.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    default:
      return 'An error occurred during authentication. Please try again later.';
  }
}
