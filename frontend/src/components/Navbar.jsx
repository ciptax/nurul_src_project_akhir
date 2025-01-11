import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ onCategorySelect }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* Navbar Utama */}
      <nav className="navbar bg-white/45 backdrop-blur-lg text-gray-900 shadow-md fixed top-0 left-0 w-full z-10 py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <strong className="text-orange-500 font-bold hover:text-orange-900 text-xl">
                Nurul SRC
              </strong>
            </Link>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="text-gray-900 font-semibold flex items-center gap-2 hover:text-orange-500"
            >
              Menu <FaBars />
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-5 left-0 w-56 bg-white/85 backdrop-blur-lg rounded-bl-lg shadow-lg py-2 z-20">
                <Link
                  to="/belanja"
                  className="block px-4 py-2 text-gray-900 hover:bg-black/10"
                  onClick={() => setDropdownOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-gray-900 hover:bg-black/10"
                  onClick={() => setDropdownOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-900 hover:bg-black/10"
                  onClick={() => setDropdownOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-gray-900 hover:bg-black/10"
                  onClick={() => setDropdownOpen(false)}
                >
                  Registrasi
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
