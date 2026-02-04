import { google } from "googleapis";
import axios from "axios";
import Task from "../models/task.js";
import { oauth2Client } from "../config/googleConfig.js";

function extractEmailBody(payload) {
    if (!payload) return "";

    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === "text/plain" && part.body?.data) {
                return Buffer.from(part.body.data, "base64").toString("utf-8");
            }
        }
    }

    if (payload.body?.data) {
        return Buffer.from(payload.body.data, "base64").toString("utf-8");
    }

    return "";
}


function normalizeDate(date) {
    const d = new Date(date);
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        0,
        0
    );
}

export const readGmailAndCreateTasks = async (req, res) => {
    try {
        const user = req.session.user;

        if (!user?.refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No Gmail permission granted"
            });
        }

        oauth2Client.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        const listRes = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10
        });

        const messages = listRes.data.messages || [];
        let createdTasks = [];

        for (const msg of messages) {
            // 1. If we already have a task with this email ID, skip immediately
            const requestStart = Date.now();
            const existingTask = await Task.findOne({ emailId: msg.id });
            if (existingTask) {
                console.log(`[Cache Hit] Skipping known email ID: ${msg.id}`);
                continue;
            }

            // 2. Fetch full message details only if it's a new email
            const msgRes = await gmail.users.messages.get({
                userId: "me",
                id: msg.id
            });

            const headers = msgRes.data.payload.headers;
            const subject =
                headers.find(h => h.name === "Subject")?.value || "No Subject";

            // 3. Check by subject if it was imported before emailId tracking
            const existingBySubject = await Task.findOne({ userID: user._id, action: subject });
            if (existingBySubject) {
                if (!existingBySubject.emailId) {
                    try {
                        existingBySubject.emailId = msg.id;
                        await existingBySubject.save();
                        console.log(`[Legacy Link] Linked old task to email: ${subject}`);
                    } catch (e) {
                        console.log(`[Race Condition] Legacy link failed: ${subject}`);
                    }
                    continue;
                }
                console.log(`[Duplicate Subject] Skipping task: ${subject}`);
                continue;
            }

            // 4. ML PROCESSING: Only new, unique emails reach here
            const body = extractEmailBody(msgRes.data.payload);
            const emailText = `${subject}. ${body}`;

            console.log("Analyze new email:\n", subject);

            const mlRes = await axios.post(
                "http://localhost:8001/analyze",
                { text: emailText },
                { timeout: 20000 }
            );

            const { priority, deadline } = mlRes.data;
            console.log("ML output:", mlRes.data);

            if (!deadline) {
                console.log("No deadline extracted, ignoring:", subject);
                continue;
            }

            // Explicit parse of ISO string
            let finalDeadline = new Date(deadline);
            finalDeadline = normalizeDate(finalDeadline);

            // 5. Create Task
            try {
                const task = await Task.create({
                    userID: user._id,
                    source: "Gmail",
                    Source: "Gmail",
                    deadline: finalDeadline,
                    priority,
                    status: "Pending",
                    action: subject,
                    emailId: msg.id
                });
                createdTasks.push(task);
                console.log(`[Created] Task created for: ${subject}`);
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`[Race Condition] Duplicate caught by DB: ${subject}`);
                    continue;
                }
                throw err;
            }
        }

        res.json({ success: true, createdTasks });

    } catch (err) {
        console.error("Gmail read error:", err);
        res.status(500).json({ success: false });
    }
};