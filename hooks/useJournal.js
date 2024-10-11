"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getJournalEntries,
  getJournalEntry,
  saveJournalEntry,
} from "@/utils/journalUtils";

export function useJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const loadEntries = async () => {
        try {
          setLoading(true);
          const fetchedEntries = await getJournalEntries(user.uid);
          setEntries(fetchedEntries || {});
          setLoading(false);
        } catch (error) {
          console.error("Failed fetching entries: ", error);
          setLoading(false);
        }
      };
      loadEntries();
    }
  }, [user]);

  // get the specified date entry by user; useCallback to memorize getEntry to avoid re-render
  const getEntry = useCallback(
    async (date) => {
      if (entries[date]) return entries[date]; // If the date entry is already available in the local state (entries), no need to fetch it again from db. This saves network bandwidth and reduces latency, providing a faster response to the user.
      try {
        // fetch if the date entry is not already present in the entries object
        setLoading(true);
        const entry = await getJournalEntry(user.uid, date);
        setEntries((prev) => ({ ...prev, [date]: entry }));
        setLoading(false);
        return entry;
      } catch (error) {
        console.error("Failed fetching date entry: ", error);
        setLoading(false);
        return {}
      }
    },
    [user, entries]
  );

  // save a specified date entry per type
  const saveEntry = async (date, entryType, data) => {
    console.log("Date: ", date, "Entry Type: ", entryType, "Data: ", data);
    if (!user) {
      console.error("User is not defined. Cannot save entry.");
      return;
    }
    try {
      setLoading(true);
      await saveJournalEntry(user.uid, date, entryType, data);
      setEntries((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          [entryType]: data,
        },
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setLoading(false);
    }
  };

  return { entries, loading, getEntry, saveEntry };
}
