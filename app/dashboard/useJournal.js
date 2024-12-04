"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getJournalEntries,
  getJournalEntry,
  saveJournalEntry,
} from "@/app/dashboard/journalUtils";

export function useJournal() {
  const { user, setUserEntriesObj } = useAuth();
  const [entries, setEntries] = useState({});

  const getEntries = async () => {
    try {
      const fetchedEntries = await getJournalEntries(user.uid);
      setEntries(fetchedEntries || {});
    } catch (error) {
      console.error("Failed fetching entries: ", error);
    }
  };

  // get the specified date entry by user; useCallback to memorize getEntry to avoid re-render
  const getEntry = useCallback(
    async (date) => {
      if (entries[date]) return entries[date]; // If the date entry is already available in the local state (entries), no need to fetch it again from db. This saves network bandwidth and reduces latency, providing a faster response to the user.
      try {
        // fetch if the date entry is not already present in the entries object
        const entry = await getJournalEntry(user.uid, date);
        setEntries((prev) => ({ ...prev, [date]: entry }));
        return entry;
      } catch (error) {
        console.error("Failed fetching date entry: ", error);
        return {};
      }
    },
    [user, entries]
  );

  // save a specified date entry per type
  const saveEntry = async (date, entryType, data) => {
    if (!user) {
      console.error("User is not defined. Cannot save entry.");
      return;
    }
    try {
      await saveJournalEntry(user.uid, date, entryType, data);
      // Update local state
      setEntries((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          [entryType]: data,
        },
      }));

      // Update global context
      setUserEntriesObj((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          [entryType]: data,
        },
      }));
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  return { entries, getEntries, getEntry, saveEntry };
}
