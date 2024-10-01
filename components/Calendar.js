"use client";

import React, { useState, useEffect } from "react";
import { gradients, baseRating, colorCombo } from "@/utils";
import { Fugaz_One, Montaga } from "next/font/google";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

const months = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};
const now = new Date();
const dayList = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export default function Calendar(props) {
  const { demo, completeData, handleSetMoodAndNote, onNoteClick } = props;

  const now = new Date();
  const currentMonth = now.getMonth(); // numerical number for the month from 0 - 11
  const monthsArr = Object.keys(months);
  console.log(monthsArr);
  const [selectedMonth, setSelectedMonth] = useState(
    Object.keys(months)[currentMonth]
  );
  const numericMonth = monthsArr.indexOf(selectedMonth);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const data =
    completeData?.[selectedYear]?.[numericMonth] || (demo ? baseRating : {});

  function handleIncrementAndDecrementMonth(val) {
    // val +1 -1
    // if we hit the bounds of the months, then we can just adjust the year that is displayed instead
    if (numericMonth + val < 0) {
      // set month value = 11 which is Dec and decrement the year
      setSelectedMonth(monthsArr[monthsArr.length - 1]);
      setSelectedYear((curr) => curr - 1);
    } else if (numericMonth + val > 11) {
      // set month numeric value = 0 which is Jan and increment the year
      setSelectedMonth(monthsArr[0]);
      setSelectedYear((curr) => curr + 1); // why not just curr + 1
    } else {
      setSelectedMonth(monthsArr[numericMonth + val]);
    }
  }

  const monthNow = new Date(
    selectedYear,
    Object.keys(months).indexOf(selectedMonth),
    1
  ); // return first day of currently assigned month, which is July 1 of 2024
  const firstDayOfMonth = monthNow.getDay(); // calculates which day of the week July 1st falls on (e.g., 0 for Sunday, 1 for Monday).
  const daysInMonth = new Date(
    selectedYear,
    Object.keys(months).indexOf(selectedMonth) + 1,
    0
  ).getDate();

  const daysToDisplay = firstDayOfMonth + daysInMonth;
  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

  return (
    //  backward and forward bar
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-4">
        <button
          className="mr-auto text-purple-400 text-lg sm:text-xl duration-200 hover:opacity-60"
          onClick={() => handleIncrementAndDecrementMonth(-1)}
        >
          <i className="fa-solid fa-circle-chevron-left"></i>
        </button>
        <p
          className={`text-center textGradient col-span-3 whitespace-nowrap ${fugaz.className}`}
        >
          {selectedMonth}, {selectedYear}
        </p>
        <button
          className="ml-auto text-purple-400 text-lg sm:text-xl duration-200 hover:opacity-60"
          onClick={() => handleIncrementAndDecrementMonth(1)}
        >
          <i class="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>
      {/* display day of week row (Sun-Sat) */}
      <div className="sm:py-6 md:py-10 grid grid-cols-7">
        {dayList.map((dayOfWeek) => <span className={`text-center textGradient ${fugaz.className}`}>{dayOfWeek}</span>)}
      </div>
      {/* calendar */}
      <div className="flex flex-col overflow-hidden gap-1 py-4 ">
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="grid grid-cols-7">
              {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                let dayIndex =
                  rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);

                // daysToDisplay: The number of days plus the offset for the starting weekday.
                // If dayIndex > daysInMonth, this means we've gone beyond the last day of the month, so no day should be displayed (dayDisplay = false).
                // For the first row (row === 0), days before firstDayOfMonth should not be displayed (they belong to the previous month), so dayDisplay = false.
                let dayDisplay =
                  dayIndex > daysInMonth
                    ? false
                    : row === 0 && dayOfWeekIndex < firstDayOfMonth
                    ? false
                    : true;

                let isToday = dayIndex === now.getDate();

                if (!dayDisplay) {
                  return <div className="bg-white dark:bg-zinc-700" key={dayOfWeekIndex}></div>;
                }

                // Fetch mood and note data
                let dayData = data[dayIndex] || {};
                let color = dayData.mood
                  ? gradients.colorCombo[dayData.mood - 1] // use mood color if available
                  : "bg-white dark:bg-zinc-700"; // default bg cell for no mood
                let hasNote = dayData.note ? true : false;
                let hasPeriod = dayData.period ? true : false;
                console.log("mood " + dayData.mood);
                return (
                  <div
                    style={{ background: color, minHeight: "60px" }}
                    key={dayOfWeekIndex}
                    className={`text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg ${
                      isToday
                        ? "border-yellow-400 border-dashed border-2"
                        : "border-purple-100"
                    } ${dayData.mood ? "text-white" : "text-purple-400 dark:text-white"} ${!dayData.mood ? color : ""}`} 
                  >
                    <p>{dayIndex}</p>
                    <div className="flex flex-col sm:flex-row gap-1 items-center" >
                      {hasNote && (
                        <span
                          role="img"
                          aria-label="note"
                          onClick={() => {
                            if (!demo) {
                              onNoteClick(dayData.note);
                            }
                          }}
                          className={demo ? "" : "cursor-pointer"} // Remove cursor-pointer if in demo view
                        >
                          📝
                        </span>
                      )}
                      {hasPeriod && (
                        <span role="img" aria-label="period">
                          ❤️
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
