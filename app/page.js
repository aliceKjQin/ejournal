"use client";

import JournalEntry from "@/components/JournalEntry";
import Main from "@/components/Main";
import { useAuth } from "@/contexts/AuthContext";
import { useJournal } from "@/hooks/useJournal";
import { useEffect, useState } from "react";
import { journalInstruction } from "@/utils";
import Tooltip from "@/components/Tooltip";
import { Roboto } from "next/font/google";
import Loading from "@/components/Loading";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });


export default function HomePage() {
  const [todayJournalData, setTodayJournalData] = useState(null);
  const { user } = useAuth();
  const { getEntry, loading } = useJournal();

  const todayDate = new Date().toLocaleDateString('en-CA'); // 'en-CA' gives the date format YYYY-MM-DD

  console.log("Today:", todayDate);

  console.log("Today's Journal Data:", todayJournalData);

  // Fetch journal data for today when component mounts or user changes
  useEffect(() => {
    if (user) {
      getEntry(todayDate)
        .then((entry) => {
          console.log("Fetched entry:", entry);
          setTodayJournalData(entry);
        })
        .catch((error) => {
          console.error("Error fetching journal data:", error);
          setTodayJournalData(null);
        });
    }
  }, [user, todayDate, todayJournalData]);

  const journalTypes = ["morning", "evening"];

  if (loading) {
    return <Loading />
  }

  return (
    <Main>
      {/* if no user, render a message to remind login and non-interactive JournalEntry component */}
      {!user ? (
        <>
          <p className={`textGradient text-lg ${roboto.className}`}>Please login to journal</p>
          {/* journal entry */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {journalTypes.map((type) => (
              <JournalEntry
                key={type}
                type={type}
                disableInteractions={!user}
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
                data={todayJournalData || ""}
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
    </Main>
  );
}
