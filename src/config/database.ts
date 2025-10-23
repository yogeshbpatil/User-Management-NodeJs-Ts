import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "user_management";

class Database {
  private static instance: Database;
  private client: MongoClient;
  private db: Db | null = null;
  private isConnected: boolean = false;

  private constructor() {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // Simplified connection options for Render
    const connectionOptions = {
      // Use ssl instead of tls for better compatibility
      ssl: true,
      sslValidate: false,

      // Connection settings
      maxPoolSize: 10,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
    };

    console.log("🔧 MongoDB Connection Options:", {
      ssl: connectionOptions.ssl,
      sslValidate: connectionOptions.sslValidate,
      maxPoolSize: connectionOptions.maxPoolSize,
    });

    this.client = new MongoClient(MONGODB_URI, connectionOptions);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<Db> {
    try {
      console.log("🔄 Attempting to connect to MongoDB Atlas...");
      console.log(
        "📡 Connection URI:",
        MONGODB_URI.replace(/:[^:]*@/, ":****@")
      ); // Hide password in logs

      await this.client.connect();
      this.db = this.client.db(DB_NAME);
      this.isConnected = true;

      // Test the connection
      await this.db.command({ ping: 1 });
      console.log("✅ Connected to MongoDB Atlas successfully");

      return this.db;
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    }
  }

  public async getDb(): Promise<Db> {
    if (!this.db || !this.isConnected) {
      await this.connect();
    }
    return this.db!;
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      this.db = null;
      console.log("📦 Disconnected from MongoDB");
    }
  }

  public isDatabaseConnected(): boolean {
    return this.isConnected;
  }
}

export default Database;
