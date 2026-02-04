import React, { useState } from "react";
import { X } from "lucide-react";

const AddTaskForm = ({ isOpen, onClose, checkSubmit }) => {
    const [taskData, setTaskData] = useState({
        action: "",
        deadline: "",
        priority: "Medium",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskData.action || !taskData.deadline) {
            alert("Please fill in all required fields.");
            return;
        }

        checkSubmit({
            ...taskData,
            source: "Manual",
        });
        // Reset form
        setTaskData({
            action: "",
            deadline: "",
            priority: "Medium",
        })
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Create New Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Description
                        </label>
                        <input
                            type="text"
                            name="action"
                            value={taskData.action}
                            onChange={handleChange}
                            placeholder="e.g., Submit project report"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            value={taskData.deadline}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                        </label>
                        <div className="flex gap-4">
                            {["High", "Medium", "Low"].map((p) => (
                                <label key={p} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p}
                                        checked={taskData.priority === p}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-gray-700">{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskForm;
