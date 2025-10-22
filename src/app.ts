import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import Database from "./config/database";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const database = Database.getInstance();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" })); // Body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/users", userRoutes);

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbStatus = database.isDatabaseConnected()
      ? "Connected"
      : "Disconnected";

    res.status(200).json({
      success: true,
      message: "Server is running healthy",
      timestamp: new Date().toISOString(),
      database: dbStatus,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Server is running but database connection failed",
      timestamp: new Date().toISOString(),
      database: "Disconnected",
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

// Start server
async function startServer() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    // Connect to database first
    await database.connect();

    // Then start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(
        `👤 User registration: http://localhost:${PORT}/api/v1/users/register`
      );
      console.log(`👥 Get all users: http://localhost:${PORT}/api/v1/users`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await database.disconnect();
  process.exit(0);
});

startServer();

export default app;
