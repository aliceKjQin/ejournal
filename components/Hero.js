import { Fugaz_One } from "next/font/google";
import React from "react";
import Calendar from "./Calendar";
import CallToAction from "./CallToAction";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Hero() {
  return (
    <div className="py-4 md:py-10 flex flex-col gap-8 sm:gap-10">
      <h1
        className={`text-5xl sm:text-6xl md:text-7xl text-center ${fugaz.className}`}
      >
        <span className="textGradient">Broodl</span> helps you track{" "}
        <span className="textGradient">daily</span> mood!
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-center w-full mx-auto max-w-[600px]">
        Create your mood record and see how you feel{" "}
        <span className="font-semibold">everyday of every year.</span>
      </p>
      <CallToAction />
      <Calendar demo />
    </div>
  );
}

// w-fit: It makes the width of the container just large enough to fit its content, preventing it from stretching to full width.
