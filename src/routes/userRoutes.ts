import { Router } from "express";
import UserController from "../controllers/userController";
import { validateUserRegistration } from "../middleware/validation";

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

export default router;
