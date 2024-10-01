"use client";

import { Fugaz_One } from "next/font/google";
import Button from "./Button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const { signup, login } = useAuth();

  async function handleSubmit() {
    if (!email || !password || password.length < 6) {
      setErrorMessage("Please provide valid email and password (min 6 characters).")
      return;
    }
    setAuthenticating(true);
    setErrorMessage("") // Clear previous error message if any
    try {
      if (isRegister) {
        console.log("Signing up a new user");
        await signup(email, password);
      } else {
        console.log("Logging in existing user");
        await login(email, password);
      }
    } catch (err) {
      console.log("Error Message: " + err.message, "Error Code: " + err.code);
      switch (err.code) {
        case "auth/user-not-found":
          setErrorMessage("No user found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email format.");
          break;
        default:
          setErrorMessage("Failed to authenticate. Please try again. OR, register first if you don't have an account yet.");
      }
    } finally {
      setAuthenticating(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4">
      <h3 className={`text-4xl sm:text-5xl md:text-6xl ${fugaz.className}`}>
        {isRegister ? "Register" : "Log In"}
      </h3>
      <p>You&#39;re one step away!</p>
      {/* Input fields */}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-purple-400 focus:border-purple-400 py-2 sm:py-3 border border-solid border-purple-300 rounded-full outline-none text-black"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-purple-400 focus:border-purple-400 py-2 sm:py-3 border border-solid border-purple-300 rounded-full outline-none text-black"
        placeholder="Passsword"
        type="password"
      />
      {/* Show error message */}
      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
      {/* Submit button */}
      <div className="max-w-[400px] w-full mx-auto">
        <Button clickHandler={handleSubmit} text={authenticating ? "submitting" : "submit"} full dark />
      </div>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p className="text-center">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setIsRegister(!isRegister)
            setErrorMessage("") // Clear error message when switching mode
          }}
          className="text-purple-400"
        >
          {isRegister ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
