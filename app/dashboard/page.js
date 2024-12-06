"use client";

import Calendar from "./Calendar";
import Main from "@/components/Main";
import SelectedJournal from "@/app/dashboard/SelectedJournal";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [completeEntries, setCompleteEntries] = useState({})

  const { user, userEntriesObj, loading: loadingAuth } = useAuth();

  // Fetch userEntriesObj
  useEffect(() => {
    if (!user || !userEntriesObj) return;
    setCompleteEntries(userEntriesObj)
  }, [user, userEntriesObj]);

  // Default the selectedDate to today using the user's local time without zero-padding for day
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are 0-indexed
      const day = today.getDate(); // No leading zero
      const formattedToday = `${year}-${month}-${day}`;
      setSelectedDate(formattedToday);
    }
  }, [selectedDate]);

  if (loadingAuth) return <Loading />

  return (
    <Main>
      <Calendar
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        completeEntries={completeEntries} // Pass entries to Calendar to reflect note icon right after journal is saved
      />
      <SelectedJournal selectedDate={selectedDate} />
    </Main>
  );
}

// Dashboard: Manages and passes shared states:'completeEntries' (which is coming from global context userEntriesObj) & 'selectedDate'.
// Calendar: Displays journal highlights (note icon and selected cell) based on shared states.
// SelectedJournal: Reads and updates entries from data which is coming from global context userEntriesObj.
