"use client";

import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const fieldsAndAnswers = [
  { field: "I am grateful for ...", answer: "my cat and good health." },
  {
    field: "What would make today great?",
    answer: "A productive day at work.",
  },
  { field: "Daily affirmation. I am ...", answer: "confident and patient." },
  {
    field: "Amazing things that happened today ...",
    answer: "a surprise visit from a friend.",
  },
  {
    field: "How could I have made today better ...",
    answer: "by getting more sleep.",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0); // Current field/answer pair index
  const [text, setText] = useState(""); // Text being typed
  const [isDeleting, setIsDeleting] = useState(false); // Whether it's deleting text
  const [isTyping, setIsTyping] = useState(true); // Whether it's typing (prevent simultaneous delete/typing, the "text blinking" issue)
  const { user } = useAuth();

  useEffect(() => {
    const currentPair = fieldsAndAnswers[currentIndex];
    let targetText = isDeleting
      ? ""
      : isTyping
      ? currentPair.field
      : `${currentPair.field} ${currentPair.answer}`;

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBeforeTypingAnswer = 1000;
    const delayBeforeDeleting = 2000;

    if (!isDeleting && text === targetText) {
      // Handle completion of typing
      if (isTyping) {
        setTimeout(() => setIsTyping(false), delayBeforeTypingAnswer);
      } else {
        setTimeout(() => setIsDeleting(true), delayBeforeDeleting);
      }
    } else if (isDeleting && text === "") {
      // Handle completion of deleting
      setIsDeleting(false);
      setIsTyping(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % fieldsAndAnswers.length);
    } else {
      // Handle typing or deleting
      const nextText = isDeleting
        ? text.substring(0, text.length - 1) // Deleting mode
        : targetText.substring(0, text.length + 1); // Typing mode

      setTimeout(() => setText(nextText), isDeleting ? deleteSpeed : typeSpeed);
    }
  }, [text, isDeleting, isTyping, currentIndex]);

  return (
    <>
      <div className="hero-container text-center py-16 bg-gradient-to-b from-stone-500 to-stone-50 rounded-3xl shadow-lg">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8 text-white">
          Welcome to eJournal
        </h1>
        <p className="text-xl sm:text-2xl font-light mb-12 text-white">
        <i className="fa-solid fa-pen-to-square mr-1"></i>
           reflect and grow {" "}
        <i className="fa-solid fa-calendar-days mr-1"></i>every day
        </p>
        <div className="typewriter bg-white text-lg sm:text-xl px-6 py-4 rounded-2xl shadow-md inline-block">
          <span>{text}</span>
          <span className="blinking-cursor"></span>
        </div>

        
        <div className="callToAction container mt-10 mx-auto">
          <Link href={user ? "/dashboard" : "/login"}>
            <Button
              text={user ? "Go to Dashboard" : "Login / Signup"}
              dark
            />
          </Link>
        </div>
      </div>
    </>
  );
}
