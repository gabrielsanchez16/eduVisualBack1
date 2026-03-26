import express from "express";
import { addStudent, getMyStudents } from "../controllers/user.controller.js";
import { isTeacher, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-student", verifyToken, isTeacher, addStudent);
router.get("/students",verifyToken,isTeacher,getMyStudents)

export default router;