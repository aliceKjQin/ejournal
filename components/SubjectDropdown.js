"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "@/firebase";

export default function SubjectDropdown() {
  const { currentUser, userDataObj, setUserDataObj } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  // hide dropdown when click outside the dropdown div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (userDataObj && userDataObj.subjects) {
      setSubjects(Object.keys(userDataObj.subjects));
    }
  }, [userDataObj]);

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleViewAll = () => {
    handleShowDropdown();
    router.push("/subjects");
  };

  const handleAddSubject = async () => {
    try {
      if (subjects.includes(newSubject)) {
        setErrorMessage("You already added this subject.");
      }
      if (newSubject.trim() && !subjects.includes(newSubject)) {
        // Initialize subjects if it doesn't exist
        const newSubjects = { ...userDataObj.subjects }; // created a shallow copy of the subjects object

        // Add new subject with default structure
        newSubjects[newSubject] = {
          targetHours: 0, // Default value or prompt user to set
          studyData: {}, // Empty studyData initially
        };

        setSubjects(Object.keys(newSubjects)); // Update local subjects state

        const newUserData = { ...userDataObj, subjects: newSubjects };
        setUserDataObj(newUserData);

        // Update Firebase
        const docRef = doc(db, "users", currentUser.uid);
        await setDoc(docRef, { subjects: newSubjects }, { merge: true });
        console.log("Added new subject successfully!");
        setNewSubject("");
        setErrorMessage("");
      }
    } catch (error) {
      console.log(`Failed to save data: ${error.message}`);
    }
  };

  const handleDeleteSubject = async (subject) => {
    try {
      // Remove the subject from the local state
      const updatedSubjects = subjects.filter((sub) => sub !== subject);
      setSubjects(updatedSubjects);

      // Create a new user data object without the deleted subject
      const newUserData = { ...userDataObj };
      delete newUserData.subjects[subject];

      // Update the global state
      setUserDataObj(newUserData);

      // Update Firebase to remove the subject
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, {
        [`subjects.${subject}`]: deleteField(),
      });

      console.log(`Subject ${subject} deleted successfully!`);
    } catch (error) {
      console.error(`Failed to delete subject: ${error.message}`);
    }
  };

  const handleSelectSubject = (subject) => {
    router.push(`/dashboard?subject=${encodeURIComponent(subject)}`);
  };

  if (!currentUser) {
    return;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button text="Subjects" clickHandler={handleShowDropdown} />
      {showDropdown && (
        <div className="absolute bg-purple-50 border mt-2 rounded-2xl shadow-lg z-10">
          {subjects.map((subject, subjectIndex) => (
            <div
              key={subjectIndex}
              className="flex justify-between items-center px-2 py-1"
            >
              <span
                onClick={() => {
                  handleShowDropdown();
                  handleSelectSubject(subject);
                }}
                className="cursor-pointer text-black uppercase"
              >
                {subject}
              </span>
              <button
                onClick={() => handleDeleteSubject(subject)}
                className="text-red-400"
              >
                Delete
              </button>
            </div>
          ))}
          {/* add subject */}
          <div className="flex items-center px-2 py-1">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="New Subject"
              className="border rounded px-2 py-1 text-black"
            />
            <button
              onClick={handleAddSubject}
              className="ml-2 bg-purple-400 text-white px-2 py-1 rounded"
            >
              Add
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          {/* view all subjects button */}
          <div className="flex justify-center py-2">
            <Button text="View All" dark clickHandler={handleViewAll} />
          </div>
        </div>
      )}
    </div>
  );
}
