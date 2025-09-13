import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"; 
import TasksPage from "./pages/Tasks/TasksPage";
import CalendarPage from "./pages/Calendar/CalendarPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import InsightsPage from "./pages/Insights/InsightsPage";
import SettingsPage from "./pages/Settings/SettingsPage";

const App = () => {
  const [active, setActive] = useState("calendar");

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar active={active} setActive={setActive} />

        <div className="flex-1 flex flex-col transition-all duration-300">
          <Header active={active} />

          <main className="flex-1 p-6 overflow-auto bg-gradient-to-b from-blue-500 to-purple-500">
            <Routes>
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/*" element={<CalendarPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
