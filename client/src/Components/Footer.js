import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-100 to-green-300 text-white px-4 py-6 md:pl-16 md:pr-8">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Educraze</h2>
          <p className="text-sm">Empowering Education for Everyone</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <a href="#" className="text-gray-600 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-white">
            Courses
          </a>
          <a href="#" className="text-gray-600 hover:text-white">
            About Us
          </a>
          <a href="#" className="text-gray-600 hover:text-white">
            Contact
          </a>
        </div>
      </div>
      <div className=" flex items-center justify-center mt-4 text-sm text-gray-500">
        <p className="">&copy; 2024 Educraze. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
