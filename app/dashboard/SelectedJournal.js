"use client";

import React from "react";
import JournalEntry from "@/app/dashboard/JournalEntry";
import { useAuth } from "@/contexts/AuthContext";
import { useJournal } from "@/app/dashboard/useJournal";
import { useEffect, useState } from "react";
import { TooltipContent } from "@/app/dashboard/ToolTipContent";
import Tooltip from "@/app/dashboard/Tooltip";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function SelectedJournal({ selectedDate }) {
  const [journalData, setJournalData] = useState({});
  const { userEntriesObj } = useAuth();
  const { getEntry, saveEntry } = useJournal();

  // Fetch selected day entry
  useEffect(() => {
    const fetchEntry = async () => {
      if (userEntriesObj && selectedDate) {
        try {
          const entry = await getEntry(selectedDate);
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
            ...entry, // Overwrites with actual entry if available, otherwise defaults
          };
          setJournalData(completeEntry);
        } catch (error) {
          console.error("Error fetching journal data:", error);
          // Provide fallback data in case of an error
          setJournalData({
            morning: {
              gratitude: ["", "", ""],
              goals: ["", "", ""],
              affirmations: ["", "", ""],
            },
            evening: {
              amazingThings: ["", "", ""],
              improvements: ["", "", ""],
            },
          });
        }
      }
    };

    fetchEntry();
  }, [userEntriesObj, selectedDate, getEntry]);

  const journalTypes = ["morning", "evening"];

  return (
    <div aria-label="selected-journal">
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
