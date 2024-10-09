"use client";

import { useState, useEffect, useRef } from "react";
import { useJournal } from "@/hooks/useJournal";
import { Roboto } from "next/font/google";
import Loading from "./Loading";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });


export default function JournalEntry({
  type,
  data,
  date,
  disableInteractions,
}) {
  const { saveEntry, loading } = useJournal();
  const [editMode, setEditMode] = useState(!data);
  const [formData, setFormData] = useState(
    data || {
      morning: {
        gratitude: ["", "", ""],
        goals: ["", "", ""],
        affirmations: ["", "", ""],
      },
      evening: {
        amazingThings: ["", "", ""],
        improvements: ["", "", ""],
      },
    }
  );

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
    setFormData(
      data || {
        morning: {
          gratitude: ["", "", ""],
          goals: ["", "", ""],
          affirmations: ["", "", ""],
        },
        evening: {
          amazingThings: ["", "", ""],
          improvements: ["", "", ""],
        },
      }
    );
    setEditMode(!data);
  }, [data]);

  // ensures that text areas are correctly sized to show all content when an old entry is loaded, without requiring user interaction.
  useEffect(() => {
    textareasRef.current.forEach((textarea) => {
      if (textarea) {
        adjustTextareaHeight(textarea)
      }
    });
  }, [formData]);

  const handleInputChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: prev[type][field].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = "auto"; // Reset the height to prevent height accumulation
    textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scrollHeight
  };

  const handleSave = async () => {
    const dataToSave = formData[type]
    await saveEntry(date, type, dataToSave);
    setEditMode(false);
  };

  return (
    <div className="bg-white dark:bg-gray-100 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className={`text-lg leading-6 font-medium ${roboto.className} textGradient`}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Entry
        </h3>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-400 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Edit
          </button>
        )}
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {fields.map((field, index) => (
            <div
              key={field}
              className={
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-purple-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6"
                  : "bg-white dark:bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6"
              }
            >
              <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">
                {displayNames[field]}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {formData[type][field].map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      {editMode ? (
                        <textarea
                          type="text"
                          value={item}
                          onChange={(e) => {
                            handleInputChange(field, itemIndex, e.target.value);
                            adjustTextareaHeight(e.target);
                          }}
                          className="flex-1 focus:ring-purple-500 block w-full min-w-0 rounded-md sm:text-sm resize-none overflow-auto border-gray-300"
                      
                          ref={(el) => (textareasRef.current[itemIndex] = el)}
                          style={{ minHeight: "50px" }}
                          rows={1}
                          disabled={disableInteractions}
                        />
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
      {editMode && !disableInteractions && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            onClick={handleSave}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-400 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
