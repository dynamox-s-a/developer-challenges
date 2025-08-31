import React from "react";
import Navbar from "./Navbar";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md top-0 left-0 z-50">
      <Navbar />
    </header>
  );
};

export default Header;
