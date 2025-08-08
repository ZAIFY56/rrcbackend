// server/index.js

import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import paymentRoutes from "./routes/paymentRoutes.js";

// Set up dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://rrcfront.netlify.app/"], // Add your frontend domain here too
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ EXPORT for Vercel (NO app.listen)
export const handler = serverless(app);
