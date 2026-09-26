import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { createResourceRoutes } from "./routes/resourceRoutes.js";
import { errorHandler, notFound } from "./controllers/errorController.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", createResourceRoutes("projects"));
app.use("/api/tasks", createResourceRoutes("tasks"));
app.use("/api/team", createResourceRoutes("team"));
app.use(notFound);
app.use(errorHandler);

export default app;
