import { Request, Response } from "express";
import UserService from "../services/userService";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler";
import { CreateUserRequest, UpdateUserRequest } from "../types/user";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;

      const newUser = await this.userService.createUser(userData);

      sendSuccessResponse(res, "User registered successfully", newUser, 201);
    } catch (error) {
      console.error("Error registering user:", error);

      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          sendErrorResponse(res, error.message, 409);
        } else {
          sendErrorResponse(res, "Failed to register user", 500, error.message);
        }
      } else {
        sendErrorResponse(res, "Failed to register user", 500);
      }
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.getAllUsers();

      sendSuccessResponse(res, "Users retrieved successfully", result);
    } catch (error) {
      console.error("Error fetching users:", error);
      sendErrorResponse(res, "Failed to fetch users", 500);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        sendErrorResponse(res, "User not found", 404);
        return;
      }

      sendSuccessResponse(res, "User retrieved successfully", user);
    } catch (error) {
      console.error("Error fetching user:", error);
      sendErrorResponse(res, "Failed to fetch user", 500);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData: UpdateUserRequest = req.body;

      const updatedUser = await this.userService.updateUser(id, userData);

      if (!updatedUser) {
        sendErrorResponse(res, "User not found", 404);
        return;
      }

      sendSuccessResponse(res, "User updated successfully", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);

      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          sendErrorResponse(res, error.message, 409);
        } else {
          sendErrorResponse(res, "Failed to update user", 500, error.message);
        }
      } else {
        sendErrorResponse(res, "Failed to update user", 500);
      }
    }
  }
}

// Export the class
export default UserController;
