"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJournal } from "@/hooks/useJournal";
import JournalEntry from "@/components/JournalEntry";
import Loading from "@/components/Loading";

export default function JournalPage({ params }) {
  const router = useRouter();
  const { getEntry, loading } = useJournal();
  const [date, setDate] = useState(params.date);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const journalEntry = await getEntry(date);
      setEntry(journalEntry);
    };
    fetchEntry();
  }, [date, getEntry]);

  // const handleDateChange = (newDate) => {
  //   setDate(newDate);
  //   router.push(`/journal/${newDate}`);
  // };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <p className="textGradient font-bold ml-2">
        Review Journal | <span className="">{date}</span>
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        { entry?.morning ? (<JournalEntry type="morning" date={date} data={entry["morning"]} />) : ""}
        { entry?.evening ? (<JournalEntry type="evening" date={date} data={entry["evening"]} />) : ""}
      </div>
    </div>
  );
}
