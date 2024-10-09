"use client";

import React, { useState, useEffect } from "react";
import { Roboto } from "next/font/google";
import { useJournal } from "@/hooks/useJournal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "./Loading";

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

export default function Calendar(props) {
  const { demo, completeData } = props;
  const { user } = useAuth();
  const { loading, entries } = useJournal();
  const router = useRouter();

  const now = new Date();
  const currentMonth = now.getMonth(); // numerical number for month from 0 - 11
  const monthsArr = Object.keys(months);
  const [selectedMonth, setSelectedMonth] = useState(monthsArr[currentMonth]);
  const numericMonth = monthsArr.indexOf(selectedMonth);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [daysHaveEntry, setDaysHaveEntry] = useState({});

  const monthNow = new Date(selectedYear, numericMonth, 1);
  const firstDayOfMonth = monthNow.getDay(); // calculates which day of the week July 1st falls on (e.g., 0 for Sunday, 1 for Monday).
  const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate();

  const entryDatesArr = Object.keys(entries);
  // Check if a day has entry in the selected month and year
  useEffect(() => {
    const checkMonthEntries = async () => {
      const newDaysHaveEntry = {};
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${selectedYear}-${String(numericMonth + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;
        if (entryDatesArr.includes(dateStr)) {
          newDaysHaveEntry[day] = { hasEntry: true, dateStr }; // Mark the day as having an entry
        }
      }
      setDaysHaveEntry(newDaysHaveEntry);
    };

    checkMonthEntries();
  }, [selectedMonth, selectedYear, user, entries]);

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

  if (loading) {
    return <Loading />;
  }

  return (
    //  backward and forward bar
    <div className="flex flex-col gap-2">
      {/* stats bar */}
      {entryDatesArr.length > 0 ? (
        <p
          className={`text-center text-base mb-10 sm:mb-16 ${roboto.className}`}
        >
          You&apos;ve been journaling for{" "}
          <span className="font-bold text-xl textGradient">
            {entryDatesArr.length}
          </span>{" "}
          days 🗓️{" "}
        </p>
      ) : (
        <p className={`text-center text-base mb-10 sm:mb-16 ${roboto.className}`}>You don&apos;t have any journal entries yet. Why not start one today and capture your thoughts? 💡</p>
      )}
      <div className="grid grid-cols-5 gap-4">
        <button
          className="mr-auto text-purple-400 text-lg sm:text-xl duration-200 hover:opacity-60"
          onClick={() => handleIncrementAndDecrementMonth(-1)}
        >
          <i className="fa-solid fa-circle-chevron-left"></i>
        </button>
        {/* div containing the month, year, and "Today" button */}
        <div className="col-span-3 flex justify-center items-center">
          <p
            className={`text-center textGradient whitespace-nowrap ${roboto.className}`}
          >
            {selectedMonth}, {selectedYear}
          </p>
          <button
            className={`ml-4 bg-purple-400 text-white px-3  rounded-lg duration-200 hover:opacity-60 ${roboto.className}`}
            onClick={handleToday}
          >
            Today
          </button>
        </div>

        <button
          className="ml-auto text-purple-400 text-lg sm:text-xl duration-200 hover:opacity-60"
          onClick={() => handleIncrementAndDecrementMonth(1)}
        >
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>
      {/* display day of week row (Sun-Sat) */}
      <div className="sm:py-6 md:py-10 grid grid-cols-7">
        {dayList.map((dayOfWeek, dayOfWeekIndex) => (
          <span
            key={dayOfWeekIndex}
            className={`text-center textGradient ${roboto.className}`}
          >
            {dayOfWeek}
          </span>
        ))}
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
                let isCurrentMonth = selectedMonth === monthsArr[currentMonth];
                let isCurrentYear = selectedYear === now.getFullYear();

                if (!dayDisplay) {
                  return (
                    <div
                      className="bg-white dark:bg-zinc-700"
                      key={dayOfWeekIndex}
                    ></div>
                  );
                }

                return (
                  <div
                    key={dayOfWeekIndex}
                    className={`text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg ${
                      isToday && isCurrentMonth && isCurrentYear
                        ? "border-yellow-400 border-dashed border-2"
                        : "border-purple-100"
                    } ${
                      daysHaveEntry[dayIndex]
                        ? "text-white bg-purple-400"
                        : "text-purple-400 dark:text-white bg-white dark:bg-zinc-700"
                    } `}
                  >
                    <p>{dayIndex}</p>
                    {daysHaveEntry[dayIndex]?.hasEntry && (
                      <span
                        role="img"
                        aria-label="journal"
                        className="cursor-pointer text-base"
                        onClick={() => {
                          router.push(
                            `/dashboard/${daysHaveEntry[dayIndex].dateStr}`
                          );
                        }}
                      >
                        📓
                      </span>
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
