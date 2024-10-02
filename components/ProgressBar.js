import React from "react";

export default function ProgressBar({ progressPercentage }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-6 sm:h-10 md:h-14  dark:bg-gray-700">
      <div
        className="bg-purple-400 h-6 sm:h-10 md:h-14 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
}
