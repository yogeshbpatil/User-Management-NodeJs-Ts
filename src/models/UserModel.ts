import { Db, Collection, ObjectId, WithId } from "mongodb";
import Database from "../config/database";
import { User, CreateUserRequest } from "../types/user";

class UserModel {
  private collection: Collection<User> | null = null;
  private database: Database;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.database = Database.getInstance();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        const db = await this.database.getDb();
        this.collection = db.collection<User>("users");
        await this.createIndexes();
        console.log("✅ UserModel initialized successfully");
      } catch (error) {
        console.error("❌ UserModel initialization failed:", error);
        throw error;
      }
    })();

    return this.initializationPromise;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.collection) {
      await this.initialize();
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.collection) return;

    try {
      await this.collection.createIndex({ emailAddress: 1 }, { unique: true });
      await this.collection.createIndex({ mobileNumber: 1 }, { unique: true });
      await this.collection.createIndex({ fullName: 1 });
      console.log("✅ Database indexes created");
    } catch (error) {
      console.error("❌ Error creating indexes:", error);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    await this.ensureInitialized();

    const user: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.collection!.insertOne(user);
    return { ...user, _id: result.insertedId.toString() };
  }

  async getAllUsers(): Promise<User[]> {
    await this.ensureInitialized();

    const users = await this.collection!.find()
      .sort({ createdAt: -1 })
      .toArray();
    return users.map((user) => this.mapUser(user));
  }

  async getUserById(id: string): Promise<User | null> {
    await this.ensureInitialized();

    const user = await this.collection!.findOne({
      _id: new ObjectId(id) as any,
    });
    return user ? this.mapUser(user) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.ensureInitialized();

    const user = await this.collection!.findOne({ emailAddress: email });
    return user ? this.mapUser(user) : null;
  }

  async getUserByMobile(mobile: string): Promise<User | null> {
    await this.ensureInitialized();

    const user = await this.collection!.findOne({ mobileNumber: mobile });
    return user ? this.mapUser(user) : null;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    await this.ensureInitialized();

    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };

    // Remove _id from update data to prevent modification
    delete (updateData as any)._id;

    const result = await this.collection!.findOneAndUpdate(
      { _id: new ObjectId(id) as any },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result ? this.mapUser(result) : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.ensureInitialized();

    const result = await this.collection!.deleteOne({
      _id: new ObjectId(id) as any,
    });
    return result.deletedCount === 1;
  }

  async getUsersCount(): Promise<number> {
    await this.ensureInitialized();
    return await this.collection!.estimatedDocumentCount();
  }

  // Helper method to map MongoDB document to User type
  private mapUser(user: WithId<User>): User {
    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      emailAddress: user.emailAddress,
      dateOfBirth: user.dateOfBirth,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      city: user.city,
      pinCode: user.pinCode,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserModel;
