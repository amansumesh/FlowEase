import express from "express";
import { getTaskStats, listTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getTaskStats);
router.get("/", authMiddleware, listTasks);
router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
