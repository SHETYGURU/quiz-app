import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md"; // ✅ Different Logout Icon
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        {/* Logo (30% Smaller) */}
        <div className="h-5 w-auto cursor-pointer" onClick={() => navigate("/")}>
          <img
            src="/assets/logo.jpg" // Replace with actual image URL or path
            alt="Logo"
            className="h-full object-contain"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4">
        {/* Profile Icon */}
        <button
          className="text-gray-600 hover:text-black focus:outline-none"
          onClick={() => navigate("/profile")}
        >
          <FaUserCircle size={24} />
        </button>

        {/* Logout Button with Different Icon */}
        <button
          className="text-gray-600 hover:text-red-600 focus:outline-none"
          onClick={() => navigate("/")} // ✅ Redirects to "/"
        >
          <MdLogout size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
