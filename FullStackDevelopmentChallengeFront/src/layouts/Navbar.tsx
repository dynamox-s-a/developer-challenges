// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md top-0 left-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-xl font-bold text-gray-800">My App</h1>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-blue-500 font-semibold hover:underline"
          >
            Create 
          </Link>
          <Link
            to="/list"
            className="text-blue-500 font-semibold hover:underline"
          >
            List 
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
