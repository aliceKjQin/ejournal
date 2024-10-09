import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

// firestore structure: users/<userId>/journalEntries/<date>; date is the unique key for each entry.

// save a new journal entry per type
export async function saveJournalEntry(userId, date, entryType, data) {
  const entryRef = doc(db, 'users', userId, 'journalEntries', date);
  await setDoc(entryRef, { [entryType]: data }, { merge: true });
}

// get a journal entry by date
export async function getJournalEntry(userId, date) {
  const entryRef = doc(db, 'users', userId, 'journalEntries', date);
  const queryResult = await getDoc(entryRef);
  return queryResult.exists() ? queryResult.data() : null;
}

// get all journal entries by user id
export async function getJournalEntries(userId) {
  try {
    const entriesRef = collection(db, 'users', userId, 'journalEntries');
    const queryResult = await getDocs(entriesRef);

    if (queryResult.empty) {
      console.log('No journal entries found for user: ', userId );
      return {};
    }
    // build entries object from query
    const entries = queryResult.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
      }, {});

    console.log("Fetched entries: ", entries)
    return entries
  } catch (error) {
    console.error('Error fetching journal entries for user: ', userId, error);
    throw new Error('Failed to fetch journal entries');
  }
}