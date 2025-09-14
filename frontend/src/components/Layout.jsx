import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1]; 
  const active = path || "tasks"; 
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={active} setActive={() => {}} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header active={active} />
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-b from-blue-500 to-purple-500">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
