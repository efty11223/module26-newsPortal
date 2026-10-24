import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: clientUrl }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "News portal API is running.",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required. Configure it in server/.env.");
  }

  await mongoose.connect(mongoUri);

  app.listen(port, () => {
    console.log(`News portal API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the news portal API:", error.message);
  process.exitCode = 1;
});
