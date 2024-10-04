"use client";

import { Roboto } from "next/font/google";
import { Suspense, useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import Loading from "./Loading";
import Login from "./Login";
const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });
import { db } from "@/firebase";
import ProgressBar from "./ProgressBar";
import { useSearchParams } from "next/navigation";


function DashboardContent() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({});
  const [studyHours, setStudyHours] = useState(null);
  const [targetHours, setTargetHours] = useState(null); // target hours state from firebase
  const [targetHoursInput, setTargetHoursInput] = useState(targetHours || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [targetHourErrorMessage, setTargetHourErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  useEffect(() => {
    if (!currentUser || !userDataObj || !subject) {
      return;
    }
    const subjectData = userDataObj.subjects[subject];
    if (subjectData) {
      setData(subjectData.studyData);
      setTargetHours(subjectData.targetHours); //set targetHours from userDataObj if available, thus main consistency across page refreshes.
    }
  }, [currentUser, userDataObj, subject]);

  // count the stats
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
    const complete_percentage =
      targetHours > 0 ? (sum_hours / targetHours) * 100 : 0;
    targetAchieved = targetHours > 0 && sum_hours >= targetHours;

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

  // function to validate study hours input
  const isValidStudyHours = (hours) => {
    const numericValue = Number(hours);
    const regex = /^\d+(\.\d{1})?$/; // Regex to match a number with at most one decimal place
    return regex.test(hours) && numericValue > 0;
  };

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

    const newUserData = { ...userDataObj };
    if (subject && newUserData.subjects[subject]) {
      newUserData.subjects[subject].targetHours = numericHours;
      setUserDataObj(newUserData);

      // Update Firebase
      try {
        const docRef = doc(db, "users", currentUser.uid);
        await setDoc(
          docRef,
          {
            subjects: {
              [subject]: {
                targetHours: numericHours,
              },
            },
          },
          { merge: true }
        );
        console.log("Target hours saved successfully!");
        setTargetHourErrorMessage("");
      } catch (err) {
        console.log(`Failed to set target hours: ${err.message}`);
      }
    } else {
      console.log("Subject not found in user data.");
    }
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
      const newUserDataObj = { ...userDataObj }; // create a copy of // Ensure the subjects structure is initialized
      if (!newUserDataObj.subjects) {
        newUserDataObj.subjects = {};
      }

      // Ensure the subject exists
      if (!newUserDataObj.subjects[subject]) {
        newUserDataObj.subjects[subject] = { studyData: {}, targetHours: 0 };
      }

      // Ensure the nested structure is initialized
      if (!newUserDataObj.subjects[subject].studyData[year]) {
        newUserDataObj.subjects[subject].studyData[year] = {};
      }
      if (!newUserDataObj.subjects[subject].studyData[year][month]) {
        newUserDataObj.subjects[subject].studyData[year][month] = {};
      }

      // Set the study hours for the specific day
      newUserDataObj.subjects[subject].studyData[year][month][day] =
        numericStudyHours;

      // update the current state
      setData(newUserDataObj);
      // update the global state
      setUserDataObj(newUserDataObj);
      // update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          subjects: {
            [subject]: {
              studyData: {
                [year]: {
                  [month]: {
                    [day]: numericStudyHours,
                  },
                },
              },
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

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="flex flex-col mt-4">
        {/* num days tracked */}
        <p
          className={`text-lg sm:text-xl mb-2 text-center ${roboto.className}`}
        >
          You have been studied{" "}
          <span className="textGradient uppercase">{subject}</span> for
          <span className={`textGradient ${roboto.className}`}>
            {" "}
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
          <h4
            className={`text-lg sm:text-xl mb-2 textGradient text-center ${roboto.className}`}
          >
            Target Hours
          </h4>
          <div className="relative">
            <input
              type="number"
              value={targetHoursInput}
              onChange={(e) => setTargetHoursInput(e.target.value)}
              placeholder={
                targetHours > 0 ? `${targetHours}` : "Enter your target"
              }
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
            <p className="text-red-500 mt-2 text-center">
              {targetHourErrorMessage}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="my-4">
          <h4
            className={`text-lg sm:text-xl mb-2 textGradient text-center ${roboto.className}`}
          >
            Progress
          </h4>
          {targetHours > 0 ? (
            <>
              <ProgressBar progressPercentage={progressPercentage} />
              <p className="text-center mt-2">
                {progressPercentage.toFixed(0)}% complete
              </p>
            </>
          ) : (
            <>
              <ProgressBar progressPercentage={progressPercentage} />
              <p className="text-center mt-2">
                No target hours set. Please set a target to track progress.
              </p>
            </>
          )}

          {statuses.targetAchieved && (
            <p className="text-green-600 mt-2 text-center">
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

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}