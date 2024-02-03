import React from "react";
import { Link } from "react-router-dom";

function Dropdown({ isOpen, onClose }) {
  return (
    <div
      className={`dropdown transition-all duration-300 ${
        isOpen ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
      } absolute right-0 top-[80px] bg-gradient-to-t to-blue-200 from-green-800 font-semibold px-8 py-5 rounded-bl-lg overflow-hidden`}
    >
      <Link
        to={"/"}
        onClick={onClose}
        className="block hover:underline cursor-pointer mb-2"
      >
        SUBMIT CONTENT
      </Link>
      <Link
        to={"/submissions"}
        onClick={onClose}
        className="block hover:underline cursor-pointer"
      >
        PAST SUBMISSIONS
      </Link>
    </div>
  );
}

export default Dropdown;
