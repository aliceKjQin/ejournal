"use client";

import JournalEntry from "@/app/dashboard/JournalEntry";
import { useAuth } from "@/contexts/AuthContext";
import { useJournal } from "@/app/dashboard/useJournal";
import { useEffect, useState } from "react";
import { TooltipContent } from "@/app/dashboard/ToolTipContent";
import Tooltip from "@/app/dashboard/Tooltip";
import { Roboto } from "next/font/google";
import Loading from "@/components/Loading";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function SelectedJournal({ selectedDate }) {
  const [journalData, setJournalData] = useState({});
  const { userEntriesObj } = useAuth();
  const { getEntry, saveEntry } = useJournal();

  // Fetch journal data for today when component mounts or user, selectedDate, journalData changes
  useEffect(() => {
    if ( userEntriesObj && selectedDate) {
      getEntry(selectedDate)
        .then((entry) => {
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
            ...entry, // **** If entry has data for one type (e.g., morning), it will overwrite the morning structure while keeping the default evening structure.; If entry return is {} (no existing entry), the completeEntry will maintain the default structure for both morning and evening, so when it pass to JournalEntry, it won't run into errors like format[field] undefined. *** if null or undefined were passed instead of an empty object, it will cause issues in rendering the JournalEntry component, as the expected structure wouldn't be available.
          };
          setJournalData(completeEntry);
        })
        .catch((error) => {
          console.error("Error fetching journal data:", error);
          setJournalData({});
        });
    }
  }, [ userEntriesObj, selectedDate, getEntry]);

  const journalTypes = ["morning", "evening"];

  return (
    <div>
      <p className="font-bold">
        Selected Date | <span className="">{selectedDate || "None"}</span>
      </p>
      {/* journal entry */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {journalTypes.map((type) => (
          <JournalEntry
            key={type}
            type={type}
            date={selectedDate}
            data={journalData?.[type]}
            saveEntry={saveEntry}
          />
        ))}
      </div>
      {/* tooltip for journal instruction */}
      <Tooltip content={TooltipContent}>
        <span>
        <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>
            Need some help to get the juice flow?
         
        </span>
      </Tooltip>
    </div>
  );
}
