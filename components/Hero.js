import { Roboto } from "next/font/google";
import React from "react";
import Calendar from "./Calendar";
import CallToAction from "./CallToAction";
import ProgressBar from "./ProgressBar";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function Hero() {
  return (
    <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10">
      <h1
        className={`text-5xl sm:text-6xl md:text-7xl text-center ${roboto.className}`}
      >
        <span className="textGradient">Stutra</span> helps you track{" "}
        <span className="textGradient">study hours</span> !
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]">
        Track your daily study hours toward your goal and{" "}
        <span className="font-semibold">feel motivated 🔥</span>
      </p>
      <CallToAction />
      <div>
        <h4
          className={`text-lg sm:text-xl mb-2 textGradient ${roboto.className}`}
        >
          Study Progress
        </h4>
        <ProgressBar progressPercentage={69} />
      </div>

      <Calendar demo />
    </div>
  );
}

// w-fit: It makes the width of the container just large enough to fit its content, preventing it from stretching to full width.
