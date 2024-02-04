// Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-14 justify-between py-6 bg-gradient-to-tr from-blue-100 to-green-400 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-lg font-semibold">EDUCRAZE</h1>
        <button
          onClick={toggleMenu}
          className="md:hidden ml-2 text-2xl focus:outline-none"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>
      <Dropdown isOpen={isMenuOpen} onClose={closeMenu} />
      <div
        className={`md:flex hidden md:space-x-5 ${isMenuOpen ? "hidden" : ""}`}
      >
        <Link
          to={"/"}
          className="hover:text-gray-600 cursor-pointer mb-2 md:mb-0"
        >
          SUBMIT CONTENT
        </Link>
        <Link
          to={"/submissions"}
          className="hover:text-gray-600 cursor-pointer"
        >
          PAST SUBMISSIONS
        </Link>
      </div>
    </div>
  );
}

export default Header;
