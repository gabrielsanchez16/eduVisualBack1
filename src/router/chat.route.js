import express from "express";
import { getUserConversations, handleChat } from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/",verifyToken, handleChat);
router.get("/conversations", verifyToken, getUserConversations);

export default router;