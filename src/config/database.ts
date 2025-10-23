import { MongoClient, Db, MongoClientOptions } from "mongodb";
import dotenv from "dotenv";

// Load appropriate .env file based on environment
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config();
}

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "user_management";

class Database {
  private static instance: Database;
  private client: MongoClient;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private connectionPromise: Promise<Db> | null = null;

  private constructor() {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // Add MongoDB connection options for SSL/TLS with proper typing
    const connectionOptions: MongoClientOptions = {
      // SSL/TLS configuration for production
      tls: true,
      tlsAllowInvalidCertificates: false,
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      // Timeout settings
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // Retry settings
      retryWrites: true,
      retryReads: true,
      // Remove the 'w' property as it's already in the connection string
    };

    this.client = new MongoClient(MONGODB_URI, connectionOptions);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<Db> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        await this.client.connect();
        this.db = this.client.db(DB_NAME);
        this.isConnected = true;
        console.log(
          `✅ Connected to MongoDB Atlas (${process.env.NODE_ENV} environment)`
        );
        resolve(this.db);
      } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
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
      this.connectionPromise = null;
      console.log("📦 Disconnected from MongoDB");
    }
  }

  public isDatabaseConnected(): boolean {
    return this.isConnected;
  }
}

export default Database;
