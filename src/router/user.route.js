import express from "express";
import { addStudent } from "../controllers/user.controller.js";
import { isTeacher, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-student", verifyToken, isTeacher, addStudent);

export default router;