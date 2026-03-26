import express from "express";
import { createTask, getMyTasks } from "../controllers/task.controller.js";
import { isStudent, isTeacher, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, isTeacher, createTask);
router.get("/my-tasks", verifyToken, isStudent, getMyTasks);

export default router;