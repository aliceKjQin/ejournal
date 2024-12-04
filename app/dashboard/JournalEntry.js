"use client";

import { useState, useEffect, useRef } from "react";
import { useJournal } from "@/app/dashboard/useJournal";
import { Roboto } from "next/font/google";
import Loading from "../../components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { validateNoteInput } from "./validateEntryInput";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

// Helper function to check if an entry is effectively empty, i.e., check the items inside the string arr of fields are all empty.
const isEntryEmpty = (entry) => {
  if (!entry) return true;
  return Object.values(entry).every((arr) => arr.every((item) => item === ""));
};

// the data passed in from homepage is the each type's entry, i.e., { amazingThings: ["", "", ""], improvements: ["","", ""]}
export default function JournalEntry({ type, data, date, saveEntry }) {
  const { user } = useAuth();

  // Initialize formData and editMode for the specific type
  const [formData, setFormData] = useState(data);
  const [editMode, setEditMode] = useState(isEntryEmpty(data));
  const [errors, setErrors] = useState({}); // Track errors for validation

  const fields =
    type === "morning"
      ? ["gratitude", "goals", "affirmations"]
      : ["amazingThings", "improvements"];

  const displayNames = {
    gratitude: "I am grateful for ...",
    goals: "What would make today great?",
    affirmations: "Daily affirmation. I am ...",
    amazingThings: "Amazing things that happened today ...",
    improvements: "How could I have made today better ...",
  };

  // Initialize a ref to store references to each textarea
  const textareasRef = useRef([]);

  useEffect(() => {
    setFormData(data);
    setEditMode(isEntryEmpty(data)); // Set editMode based on the specific type's data
  }, [data]);

  // ensures that text areas are correctly sized to show all content when an old entry is loaded, without requiring user interaction.
  useEffect(() => {
    textareasRef.current.forEach((textarea) => {
      if (textarea) {
        adjustTextareaHeight(textarea);
      }
    });
  }, [formData]);

  const handleInputChange = (field, index, value) => {
    const validationResult = validateNoteInput(value);

    if (!validationResult.valid) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [index]: validationResult.message,
        },
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [index]: null,
        },
      }));
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item)),
      }));
    }
  };

  // Function to check if there are any errors from validation, return boolean flag
  const hasErrors = () => {
    return Object.values(errors).some((fieldErrors) =>
      Object.values(fieldErrors).some((errorMessage) => errorMessage !== null)
    );
  };

  const handleSave = async () => {
    // Only allow save if there are no validation errors
    if (!hasErrors()) {
      await saveEntry(date, type, formData);
      setEditMode(false);
    } else {
      console.error("Fix validation errors before saving.");
    }
  };

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = "auto"; // Reset the height to prevent height accumulation
    textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scrollHeight
  };

  return (
    <div className="bg-stone-300 shadow-lg overflow-hidden rounded-lg text-sm">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className={`text-lg capitalize leading-6 font-bold`}>
          {type} Entry
        </h3>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 border border-transparent  font-medium rounded-full text-white bg-stone-500 hover:bg-stone-600"
          >
            Edit
          </button>
        )}
      </div>
      <div className="">
        <dl>
          {fields.map((field, index) => (
            <div
              key={field}
              className={
                index % 2 === 0
                  ? "bg-stone-50 px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6"
                  : "bg-white px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6"
              }
            >
              <dt className="font-semibold text-stone-500 whitespace-nowrap">
                {displayNames[field]}
              </dt>
              <dd className="mt-1  sm:mt-0 sm:col-span-2">
                <ul className="border border-stone-200 rounded-md">
                  {formData?.[field].map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="pl-3 pr-3 py-1 flex flex-col items-start"
                    >
                      {editMode ? (
                        <>
                          <textarea
                            type="text"
                            value={item}
                            onChange={(e) => {
                              handleInputChange(
                                field,
                                itemIndex,
                                e.target.value
                              );
                              adjustTextareaHeight(e.target);
                            }}
                            className="border border-solid  focus:border-yellow-400 focus:outline focus:outline-yellow-200 w-full min-w-0 rounded-md sm: resize-none overflow-auto"
                            ref={(el) => (textareasRef.current[itemIndex] = el)}
                            // style={{ minHeight: "30px" }}
                          />
                          {errors?.[field]?.[itemIndex] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[field][itemIndex]}
                            </p>
                          )}
                        </>
                      ) : (
                        <span
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {item}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {editMode && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            onClick={handleSave}
            disabled={hasErrors()} // Disable the Save button if there are errors
            className="px-4 py-2 border border-transparent  font-medium rounded-full text-white bg-stone-500 hover:bg-stone-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
