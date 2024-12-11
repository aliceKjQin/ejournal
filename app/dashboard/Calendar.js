"use client";

import React, { useState } from "react";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

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

const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  onDateSelect,
  selectedDate,
  completeEntries,
}) {
  const now = new Date();
  const currentMonth = now.getMonth(); // numerical number for month from 0 - 11
  const monthsArr = Object.keys(months);
  const [selectedMonth, setSelectedMonth] = useState(monthsArr[currentMonth]);
  const numericMonth = monthsArr.indexOf(selectedMonth);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthNow = new Date(selectedYear, numericMonth, 1);
  const firstDayOfMonth = monthNow.getDay(); // calculates which day of the week July 1st falls on (e.g., 0 for Sunday, 1 for Monday).
  const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate();

  const handleDateSelect = (dayIndex) => {
    const dateStr = `${selectedYear}-${numericMonth + 1}-${dayIndex}`;
    onDateSelect(dateStr);
  };

  function handleIncrementAndDecrementMonth(val) {
    // val +1 -1
    // if hit the bounds of the months, then just adjust the year that is displayed instead
    if (numericMonth + val < 0) {
      // set month value = 11 which is Dec and decrement the year
      setSelectedMonth(monthsArr[monthsArr.length - 1]);
      setSelectedYear((curr) => curr - 1);
    } else if (numericMonth + val > 11) {
      // set month numeric value = 0 which is Jan and increment the year
      setSelectedMonth(monthsArr[0]);
      setSelectedYear((curr) => curr + 1);
    } else {
      setSelectedMonth(monthsArr[numericMonth + val]);
    }
  }

  // function for today button
  const handleToday = () => {
    setSelectedMonth(monthsArr[currentMonth]);
    setSelectedYear(now.getFullYear());
  };

  const daysToDisplay = firstDayOfMonth + daysInMonth;
  const numRows = Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0);

  return (
    <div className="flex flex-col gap-2">
      {/* Total journal days */}
      {Object.keys(completeEntries).length > 0 ? (
        <p
          className={`text-center sm:text-base mb-4 sm:mb-6 ${roboto.className}`}
        >
          <i className="fa-solid fa-calendar-days mr-2"></i>
          Total journal days: {Object.keys(completeEntries).length}
        </p>
      ) : (
        <p className={`text-center text-base mb-4 sm:mb-6 ${roboto.className}`}>
          You don&apos;t have any journal entries yet. Why not start one today
          and capture your thoughts?
        </p>
      )}
      {/* Month, year backward and forward bar */}
      <div className="grid grid-cols-5 gap-4">
        <button
          className="mr-auto text-lg sm:text-xl duration-200 hover:opacity-60"
          onClick={() => handleIncrementAndDecrementMonth(-1)}
        >
          <i className="fa-solid fa-circle-chevron-left"></i>
        </button>
        {/* div containing the month, year, and "Today" button */}
        <div className="col-span-3 flex justify-center items-center">
          <p className={`text-center whitespace-nowrap ${roboto.className}`}>
            {selectedMonth}, {selectedYear}
          </p>
          <button
            className={`ml-4 bg-stone-400 text-white px-3  rounded-lg duration-200 hover:opacity-60 ${roboto.className}`}
            onClick={handleToday}
          >
            Today
          </button>
        </div>

        <button
          className="ml-auto text-lg sm:text-xl duration-200 hover:opacity-60"
          onClick={() => handleIncrementAndDecrementMonth(1)}
        >
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>
      {/* Sun-Sat header row */}
      <div className="sm:py-2 grid grid-cols-7 text-xs sm:text-sm">
        {dayList.map((dayOfWeek, dayOfWeekIndex) => (
          <span key={dayOfWeekIndex} className={`text-center font-semibold`}>
            {dayOfWeek}
          </span>
        ))}
      </div>
      {/* Calendar grid */}
      <div
        className="flex flex-col overflow-hidden gap-1 mb-6"
        aria-label="calendar-grid"
      >
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
                let isCurrentMonth = selectedMonth === monthsArr[currentMonth];
                let isCurrentYear = selectedYear === now.getFullYear();

                if (!dayDisplay) {
                  return <div key={dayOfWeekIndex}></div>;
                }

                const formattedDate = `${selectedYear}-${
                  numericMonth + 1
                }-${dayIndex}`;
                const hasEntry = completeEntries[formattedDate];
                const isSelected = selectedDate === formattedDate;

                return (
                  <div
                    key={dayOfWeekIndex}
                    className={`text-xs text-stone-600 sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg ${
                      isSelected
                        ? "border-yellow-400 border-2" // Selected day styling
                        : isToday && isCurrentMonth && isCurrentYear
                        ? "border-yellow-400 border-dashed border-2" // Today's styling
                        : "border-stone-300" // Default border styling
                    } ${hasEntry ? "bg-stone-400" : ""}
                     `}
                    onClick={() => handleDateSelect(dayIndex)}
                  >
                    <p>{dayIndex}</p>
                    {hasEntry && (
                      <i className="fa-solid fa-pen-to-square fa-lg text-yellow-400"></i>
                    )}
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
