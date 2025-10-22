import UserModel from "../models/UserModel";
import { User, CreateUserRequest, UserListResponse } from "../types/user";

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    // Check if email already exists
    const existingUserByEmail = await this.userModel.getUserByEmail(
      userData.emailAddress
    );
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    // Check if mobile number already exists
    const existingUserByMobile = await this.userModel.getUserByMobile(
      userData.mobileNumber
    );
    if (existingUserByMobile) {
      throw new Error("User with this mobile number already exists");
    }

    return await this.userModel.createUser(userData);
  }

  async getAllUsers(): Promise<UserListResponse> {
    const users = await this.userModel.getAllUsers();
    const total = await this.userModel.getUsersCount();

    return {
      users,
      total,
      showing: users.length,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userModel.getUserById(id);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    return await this.userModel.updateUser(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userModel.deleteUser(id);
  }
}

// Export the class, not an instance
export default UserService;
