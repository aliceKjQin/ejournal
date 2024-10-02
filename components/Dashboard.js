"use client";

import { Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import Loading from "./Loading";
import Login from "./Login";
const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });
import { db } from "@/firebase";
import ProgressBar from "./ProgressBar";

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({});
  const [studyHours, setStudyHours] = useState(null);
  const [targetHours, setTargetHours] = useState(null); // target hours state from firebase
  const [targetHoursInput, setTargetHoursInput] = useState(targetHours || "")
  const [errorMessage, setErrorMessage] = useState("");
  const [targetHourErrorMessage, setTargetHourErrorMessage] = useState("");

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  // count the stats to be displayed in the statuses
  function countValues() {
    let total_number_of_days = 0;
    let sum_hours = 0;
    let targetAchieved = false;

    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_hour = data[year][month][day];
          total_number_of_days++;
          sum_hours += days_hour;
        }
      }
    }

    const complete_percentage = targetHours ? (sum_hours / targetHours) * 100 : "0"
    targetAchieved = sum_hours >= targetHours && targetHours;

    return {
      num_days: total_number_of_days,
      complete_percentage: complete_percentage,
      targetAchieved: targetAchieved,
      sum_hours,
    };
  }

  const statuses = {
    ...countValues(),
  };

  // Calculate progress percentage
  const progressPercentage = statuses.complete_percentage;

  // Function to save target hours
  const handleSetTargetHours = async (hours) => {
    if (!isValidStudyHours(hours)) {
      setTargetHourErrorMessage(
        "Please enter a valid number greater than 0 with at most one decimal."
      );
      return;
    }

    const numericHours = Number(hours); // convert to number first, as all values from input fields are retrieved as strings
    setTargetHours(numericHours);
    const newUserData = { ...userDataObj, targetHours: numericHours };
    setUserDataObj(newUserData);

    // update firebase
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, { targetHours: numericHours }, { merge: true });
      console.log("Target hours saved successfully!");
      setTargetHourErrorMessage("");
    } catch (err) {
      console.log(`Failed to set target hours: ${err.message}`);
    }
  };

  // function to validate study hours input
  const isValidStudyHours = (hours) => {
    const numericValue = Number(hours);
    const regex = /^\d+(\.\d{1})?$/; // Regex to match a number with at most one decimal place
    return regex.test(hours) && numericValue > 0;
  };

  // function to save studyHours for the current calendar day
  async function handleSetStudyHours(studyHours) {
    if (!isValidStudyHours(studyHours)) {
      setErrorMessage(
        "Please enter a valid number greater than 0 with at most one decimal."
      );
      return;
    }

    const numericStudyHours = Number(studyHours);
    try {
      const newData = { ...userDataObj }; // create a copy of userDataObj
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      newData[year][month][day] = numericStudyHours;
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
              [day]: numericStudyHours,
            },
          },
        },
        { merge: true }
      );
      console.log("Study hour saved successfully!");
      setStudyHours(""); // clear the input field after save
      setErrorMessage(""); // clear error message after successful save
    } catch (err) {
      console.log(`Failed to set data: ${err.message}`);
    }
  }

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    setData(userDataObj);

    // set targetHours from userDataObj if available, thus main consistency across page refreshes.
    if (userDataObj.targetHours) {
      setTargetHours(userDataObj.targetHours);
    }
  }, [currentUser, userDataObj]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      {/* <div className="flex justify-between bg-purple-50 text-purple-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className="p-4 flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p
                className={`text-base sm:text-lg truncate ${roboto.className}`}
              >
                {statuses[status]}
                {status === "num_days" && statuses[status] !== 0 ? " 🙌" : ""}
              </p>
            </div>
          );
        })}
      </div> */}
      <div className="flex flex-col mt-4">
        {/* num days tracked */}
        <p className={`text-lg sm:text-xl mb-2 ${roboto.className}`}>
          You have been studied for{" "}
          <span className={`textGradient ${roboto.className}`}>
            {statuses.num_days}
          </span>{" "}
          days,{" "}
          <span className={`textGradient ${roboto.className}`}>
            {statuses.sum_hours}
          </span>{" "}
          hrs in total
        </p>
        {/* Target Hours Input */}
        <div className="p-4 flex flex-col gap-1 sm:gap-2">
          <p
            className={`text-lg sm:text-xl mb-2 textGradient ${roboto.className}`}
          >
            Target Hours
          </p>
          <div className="relative">
            <input
              type="number"
              value={targetHoursInput}
              onChange={(e) => setTargetHoursInput(e.target.value)}
              placeholder={targetHours ? `${targetHours}` : "Enter your target"}
              className="w-full px-3 duration-200 hover:border-purple-400 focus:border-purple-400 py-2 sm:py-3 border border-solid border-purple-300 rounded-full outline-none text-black"
            />
            <button
              onClick={() => handleSetTargetHours(targetHoursInput)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 font-bold text-purple-400 hover:text-purple-300"
            >
              {targetHours ? "Update" : "Save"}
            </button>
          </div>

          {targetHourErrorMessage && (
            <p className="text-red-500 mt-2">{targetHourErrorMessage}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="my-4">
          <h4
            className={`text-lg sm:text-xl mb-2 textGradient ${roboto.className}`}
          >
            Study Progress
          </h4>
          <ProgressBar progressPercentage={progressPercentage} />
          {statuses.targetAchieved && (
            <p className="text-green-600 mt-2">
              🥳 Congrats! You hit the target!
            </p>
          )}
        </div>
      </div>

      <h4
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + roboto.className
        }
      >
        Did you <span className="textGradient">study</span> today?
      </h4>
      {/* studyHours input field and submit button  */}
      <div className="w-full max-w-[300px] sm:max-w-[400px] mx-auto">
        <div className="relative">
          <input
            type="number"
            value={studyHours}
            onChange={(e) => setStudyHours(e.target.value)}
            placeholder="Enter study hours"
            className="w-full px-3 duration-200 hover:border-purple-400 focus:border-purple-400 py-2 sm:py-3 border border-solid border-purple-300 rounded-full outline-none text-black"
          />
          <button
            type="button"
            onClick={() => {
              handleSetStudyHours(studyHours);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 font-bold text-purple-400 hover:text-purple-300"
          >
            Save
          </button>
        </div>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>

      <Calendar completeData={data} />
    </div>
  );
}
