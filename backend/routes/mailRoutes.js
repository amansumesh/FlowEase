import express from "express";
import { readGmailAndCreateTasks } from "../controllers/mailController.js";

const router = express.Router();

router.post("/sync", readGmailAndCreateTasks);

export default router;