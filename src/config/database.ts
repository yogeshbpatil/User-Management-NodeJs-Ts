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
  private connectionPromise: Promise<Db> | null = null;

  private constructor() {
    this.client = new MongoClient(MONGODB_URI);
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
        console.log("✅ Connected to MongoDB Atlas");
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
