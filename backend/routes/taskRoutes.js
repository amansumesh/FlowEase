import express from "express";
import { getTaskStats, listTasks } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getTaskStats);
router.get("/", authMiddleware, listTasks);

export default router;
