"use client";

import JournalEntry from "@/components/JournalEntry";
import { useAuth } from "@/contexts/AuthContext";
import { useJournal } from "@/hooks/useJournal";
import { useEffect, useState } from "react";
import { journalInstruction } from "@/utils";
import Tooltip from "@/components/Tooltip";
import { Roboto } from "next/font/google";
import Loading from "@/components/Loading";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function TodayJournal() {
    const [todayJournalData, setTodayJournalData] = useState({});
    const { user } = useAuth();
    const { getEntry, loading } = useJournal();
  
    const todayDate = new Date().toLocaleDateString('en-CA'); // 'en-CA' gives the date format YYYY-MM-DD
  
    // Fetch journal data for today when component mounts or user, todayDate, todayJournalData changes
    useEffect(() => {
      if (user) {
        getEntry(todayDate)
          .then((entry) => {
            console.log("Fetched entry:", entry);
            // Ensure both morning and evening structures exist, before passing to JournalEntry component
            const completeEntry = {
              morning: {
                gratitude: ["", "", ""],
                goals: ["", "", ""],
                affirmations: ["", "", ""],
              },
              evening: {
                amazingThings: ["", "", ""],
                improvements: ["", "", ""],
              },
              ...entry // If entry has data for one type (e.g., morning), it will overwrite the morning structure while keeping the default evening structure.; If entry return is {} (no existing entry), the completeEntry will maintain the default structure for both morning and evening, so when it pass to JournalEntry, it won't run into errors like format[field] undefined. *** if null or undefined were passed instead of an empty object, it will cause issues in rendering the JournalEntry component, as the expected structure wouldn't be available.
            };
            setTodayJournalData(completeEntry);
          })
          .catch((error) => {
            console.error("Error fetching journal data:", error);
            setTodayJournalData({});
          });
      }
    }, [user, todayDate, getEntry]);
  
    const journalTypes = ["morning", "evening"];
  
    if (loading && user) {
      return <Loading />
    }
  return (
    <div>
        {/* if no user, render a message to remind login and non-interactive JournalEntry component */}
      {!user ? (
        <>
          <p className={`text-l ${roboto.className}`}>Please login to journal</p>
          {/* journal entry */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {journalTypes.map((type) => (
              <JournalEntry
                key={type}
                type={type}
                disableButton={!user}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <p className="textGradient font-bold">
            Today | <span className="">{todayDate}</span>
          </p>
          {/* journal entry */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {journalTypes.map((type) => (
              <JournalEntry
                key={type}
                type={type}
                date={todayDate}
                data={todayJournalData?.[type]}           
              />
            ))}
          </div>
          {/* tooltip for journal instruction */}
          <Tooltip content={journalInstruction}>
            <span>
              💡 <span className="textGradient">Need some help to get the juice flow?</span>
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
