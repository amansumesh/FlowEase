import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from '../axiosConfig';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};


export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        if (isMounted) {
          if (res.data.success && Array.isArray(res.data.tasks)) {
            setTasks(res.data.tasks);
          } else if (Array.isArray(res.data)) {
            setTasks(res.data);
          }
        }
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    };

    const runSync = async () => {
      try {
        console.log("Starting background sync...");
        await axios.post('/api/mail/sync');
        console.log("Sync complete, refetching...");
        if (isMounted) fetchTasks();
      } catch (e) {
        console.error('Background Gmail sync failed', e);
      }
    };

    // 1. Fetch immediately from DB
    fetchTasks();

    // 2. Trigger sync in background (non-blocking)
    runSync();

    return () => { isMounted = false; };
  }, []);

  const toggleTaskCompletion = useCallback(async (taskId) => {
    // Optimistic update
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    const oldTask = tasks[taskIndex];
    const newStatus = oldTask.completed ? "Pending" : "Completed";

    // Update local state immediately
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed, status: newStatus } : t));

    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task completion", error);
      // Revert on failure
      setTasks(prev => prev.map(t => t.id === taskId ? oldTask : t));
    }
  }, [tasks]);

  const addTask = useCallback(async (newTask) => {
    try {
      const res = await axios.post('/api/tasks', newTask);
      if (res.data.success) {
        // Adapt backend task format to frontend format if necessary
        const t = res.data.task;
        const formattedTask = {
          id: String(t._id),
          action: t.action,
          task_description: "",
          deadline: t.deadline,
          priority: t.priority,
          source: t.source || t.Source || "Manual",
          category: t.source || t.Source || "Manual",
          completed: t.status === "Completed",
          created_at: t.createdAt
        };
        setTasks(prev => [...prev, formattedTask]);
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    try {
      await axios.patch(`/api/tasks/${taskId}`, updates);
    } catch (error) {
      console.error("Failed to update task", error);
      // Re-fetch to sync state would be safest, or revert if complex
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    // Optimistic update
    const oldTasks = tasks;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await axios.delete(`/api/tasks/${taskId}`);
    } catch (error) {
      console.error("Failed to delete task", error);
      setTasks(oldTasks);
    }
  }, [tasks]);

  const syncGmail = useCallback(async () => {
    try {
      // Trigger Gmail + ML sync
      await axios.post('/api/mail/sync');

      const res = await axios.get('/api/tasks');
      if (res.data.success && Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (e) {
      console.error('Gmail sync failed', e);
    }
  }, []);

  const getTasksByDate = useCallback((date) => {
    const targetDate = new Date(date);
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === targetDate.toDateString();
    });
  }, [tasks]);

  const getTasksByStatus = useCallback((status) => {
    switch (status) {
      case 'all':
        return tasks;
      case 'urgent':
        return tasks.filter(task => task.priority === 'High' && !task.completed);
      case 'upcoming':
        return tasks.filter(task => {
          if (task.completed || !task.deadline) return false;
          const now = new Date();
          const taskDate = new Date(task.deadline);
          const diffTime = taskDate - now;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 7;
        });
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks]);

  const value = {
    tasks,
    toggleTaskCompletion,
    addTask,
    updateTask,
    deleteTask,
    getTasksByDate,
    getTasksByStatus,
    syncGmail
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
