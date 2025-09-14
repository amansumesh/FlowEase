import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const Header = ({ active, onLogout }) => {
  const [searchValue, setSearchValue] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (active) {
      case "tasks":
        setTitle("Tasks Overview");
        break;
      case "notifications":
        setTitle("Notifications");
        break;
      case "insights":
        setTitle("Insights and Analytics");
        break;
      case "calendar":
        setTitle("Calendar View");
        break;
      case "settings":
        setTitle("Settings");
        break;
      default:
        setTitle("");
    }
  }, [active]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg font-inter">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative w-64 md:w-96">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search />
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-purple-700 text-white font-bold rounded-full hover:bg-purple-800 transition-colors duration-200">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
