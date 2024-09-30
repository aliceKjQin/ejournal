"use client";

import { Fugaz_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { average, doc, setDoc } from "firebase/firestore";
import Loading from "./Loading";
import Login from "./Login";
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });
import { db } from "@/firebase";
import NoteModal from "./NoteModal";
import Button from "./Button";

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({});
  const [selectedMood, setSelectedMood] = useState(null); // State for selected mood
  const [showNoteModal, setShowNoteModal] = useState(false); // Control modal visibility
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [period, setPeriod] = useState(true);
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  const hasPeriod = userDataObj?.[year]?.[month]?.[day]?.period === true;
  console.log(hasPeriod);

  // count the stats to be displayed in the statuses
  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;

    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_mood = data[year][month][day].mood;
          total_number_of_days++;
          sum_moods += days_mood;
        }
      }
    }
    return {
      num_days: total_number_of_days,
      average_mood: (sum_moods / total_number_of_days).toFixed(1),
    };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };
  // handle set mood and note for the current calendar day
  async function handleSetMoodAndNote(mood, note = "") {
    try {
      const newData = { ...userDataObj }; // create a copy of userDataObj
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      // merge newly added mood and note with existing data for the day
      const existingDayData = newData[year][month][day] || {};
      newData[year][month][day] = { ...existingDayData, mood, note };
      // update the current state
      setData(newData);
      // update the global state
      setUserDataObj(newData);
      // update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: { mood, note },
            },
          },
        },
        { merge: true }
      );
      console.log("Mood saved successfully!");
    } catch (err) {
      console.log(`Failed to set data: ${err.message}`);
    }
  }

  // handle set period for the current calendar day
  async function handleSetPeriod(period) {
    try {
      const newData = { ...userDataObj }; // create a copy of userDataObj
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      // merge new period value with existing data for the day
      const existingDayData = newData[year][month][day] || {};
      newData[year][month][day] = { ...existingDayData, period };
      // update the current state
      setData(newData);
      // update the global state
      setUserDataObj(newData);
      // update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: { period },
            },
          },
        },
        { merge: true }
      );
      console.log("Period saved successfully!");
    } catch (err) {
      console.log(`Failed to set data: ${err.message}`);
    }
  }

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsNoteVisible(true);
  };

  const toggleNoteVisibility = () => {
    setIsNoteVisible(!isNoteVisible);
  };
  const moods = {
    "Under the Weather": { emoji: "😩", bgColor: "bg-neutral-400" },
    Meh: { emoji: "👎", bgColor: "bg-red-400" },
    Productive: { emoji: "👍", bgColor: "bg-teal-400" },
  };

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 bg-purple-50 text-purple-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className="p-4 flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p className={`text-base sm:text-lg truncate ${fugaz.className}`}>
                {statuses[status]}
                {status === "num_days" ? " 🙌" : ""}
                {status === "average_mood" && statuses[status] > 2 ? " 👍" : ""}
                {status === "average_mood" && statuses[status] < 2 ? " 😩" : ""}
                {status === "average_mood" && statuses[status] === 2
                  ? " 👎"
                  : ""}
              </p>
            </div>
          );
        })}
      </div>
      <h4
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className
        }
      >
        How do you <span className="textGradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          const { emoji, bgColor } = moods[mood];
          return (
            <button
              onClick={() => {
                const currentMoodValue = moodIndex + 1;
                setSelectedMood(currentMoodValue);
                setShowNoteModal(true);
              }}
              key={moodIndex}
              className={`p-4 px-5 rounded-2xl purpleShadow duration:200 ${bgColor} hover:bg-purple-100 text-center flex flex-col gap-2 flex-1`}
            >
              <p className="text-4xl sm:text-5xl md:text-6xl">{emoji}</p>
              <p
                className={`text-stone-50 text-xs sm:text-sm md:text-base ${fugaz.className}`}
              >
                {mood}
              </p>
            </button>
          );
        })}
        <button
          onClick={() => {
            handleSetPeriod(period);
            setPeriod(!period);
          }}
          className={`p-4 mx-auto sm:ml-12 px-5 rounded-3xl purpleShadow duration:200 bg-blue-400 hover:bg-purple-100 text-center`}
        >
          <p className="text-2xl sm:text-4xl md:text-5xl">❤️</p>
          <p
            className={`text-stone-50 text-xs sm:text-sm md:text-base ${fugaz.className}`}
          >
            {hasPeriod ? "Remove Period" : "Add Period"}
          </p>
        </button>
      </div>

      {/* Note modal to add optional note when user selects a mood */}
      {showNoteModal && (
        <NoteModal
          onSave={(note) => {
            handleSetMoodAndNote(selectedMood, note);
            setShowNoteModal(false);
          }}
          onClose={() => setShowNoteModal(false)}
        />
      )}
      {/* display the note when user clicks the note emoji */}
      {selectedNote && isNoteVisible && (
        <div className="relative flex flex-col bg-purple-50 text-purple-500 p-4 gap-4 rounded-lg">
          <p>{selectedNote}</p>
          <div className="flex justify-end mt-auto">
            <Button clickHandler={toggleNoteVisibility} text="Close" dark />
          </div>
        </div>
      )}

      <Calendar completeData={data} onNoteClick={handleNoteClick} />

    </div>
  );
}
