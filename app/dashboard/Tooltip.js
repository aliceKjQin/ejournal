import { useState } from "react";

export default function Tooltip({ children, content }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleTouchStart = () => {
    setIsHovered((prev) => !prev);
  };

  return (
    <div
      className="mt-6 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart} // Toggle on touch for mobile screen
    >
      {children}
      {isHovered && <div className="mt-2 transition-opacity duration-200 ease-in-out">{content}</div>}
    </div>
  );
}



