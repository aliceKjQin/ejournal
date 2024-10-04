"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import Login from "./Login";
import ProgressBar from "./ProgressBar";
import { calculateSubjectProgress } from "@/utils";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });


export default function SubjectsView() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [subjects, setSubjects] = useState([]);
  // ensure component always has the most up-to-date subjects list
  useEffect(() => {
    if (userDataObj && userDataObj.subjects) {
      setSubjects(Object.keys(userDataObj.subjects));
    }
  }, [userDataObj]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {Object.entries(userDataObj.subjects).map(([subjectName, subjectData]) => (
        <div key={subjectName} className="flex flex-col gap-2 sm:gap-4">
          <h4 className={`text-lg sm:text-xl mb-1 textGradient uppercase ${roboto.className}`}>{subjectName}</h4>
          <ProgressBar progressPercentage={calculateSubjectProgress(subjectData).progressPercentage} />
          <p>Target Hours: {subjectData.targetHours}</p>
          {/* Add more subject details as needed */}
        </div>
      ))}
    </div>
  );
}
