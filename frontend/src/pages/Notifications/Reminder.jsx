import React from "react";
import { Clock, Bell } from "lucide-react";

const Reminder = () => {
    return (
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Clock className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-medium text-gray-800">Upcoming Reminders</h2>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">No upcoming reminders</p>
            </div>
        </div>
    );
};

export default Reminder;
