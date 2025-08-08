import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/paymentRoutes.js";

// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://rrcfront.netlify.app"],
    methods: ["GET", "POST"],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/payments", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Vercel Serverless Export
export default app;
