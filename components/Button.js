import { Roboto } from "next/font/google";
import React from "react";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });


export default function Button(props) {
  const { text, dark, full, clickHandler } = props;
  return (
    <button onClick={clickHandler} className={`rounded-full overflow-hidden duration-200 hover:opacity-60 border-2 border-solid border-yellow-400 ${dark ? 'text-white bg-yellow-400' : 'text-yellow-400'} ${full ? 'grid place-items-center w-full' : '' }`}>
      <p className={`px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 ${roboto.className}`}>{text}</p>
    </button>
  );
}
