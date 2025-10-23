import app from "./app";
import Database from "./config/database";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const database = Database.getInstance();

    console.log("🔄 Attempting to connect to MongoDB Atlas...");
    await database.connect();
    console.log("✅ MongoDB Atlas connection established successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server started successfully on port ${PORT}`);
      console.log(`📍 Health check endpoint: http://localhost:${PORT}/health`);
      console.log(
        `👤 User API endpoint: http://localhost:${PORT}/api/v1/users`
      );
      console.log("----------------------------------------------------");
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
})();
