import React from "react";

export default function Loading() {
  return (
    <div
      className="flex flex-col flex-1 justify-center items-center"
      role="status"
      aria-label="Loading"
    >
      <i className="fa-solid text-yellow-500 fa-spinner animate-spin text-4xl sm:text-5xl "></i>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
