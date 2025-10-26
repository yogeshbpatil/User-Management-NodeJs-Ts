import { Router } from "express";
import UserController from "../controllers/userController";
import {
  validateUserRegistration,
  validateUserUpdate,
} from "../middleware/validation";

const router = Router();

// Create controller instances when routes are actually used
const getController = () => new UserController();

// POST /api/v1/users/register - Register new user
router.post("/register", validateUserRegistration, async (req, res) => {
  const controller = getController();
  await controller.registerUser(req, res);
});

// GET /api/v1/users - Get all users
router.get("/", async (req, res) => {
  const controller = getController();
  await controller.getUsers(req, res);
});

// GET /api/v1/users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  const controller = getController();
  await controller.getUserById(req, res);
});

// PUT /api/v1/users/:id - Update user by ID
router.put("/:id", validateUserUpdate, async (req, res) => {
  const controller = getController();
  await controller.updateUser(req, res);
});

// ✅ ADD DELETE ROUTE HERE
// DELETE /api/v1/users/:id - Delete user by ID
router.delete("/:id", async (req, res) => {
  const controller = getController();
  await controller.deleteUser(req, res);
});

export default router;
