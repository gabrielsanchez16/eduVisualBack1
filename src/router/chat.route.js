import express from "express";
import { createTaskFromChat, deleteConversation, getMessagesByConversation, getUserConversations, handleChat } from "../controllers/chat.controller.js";
import { isTeacher, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/",verifyToken, handleChat);
router.get("/conversations", verifyToken, getUserConversations);
router.get("/messages/:id", verifyToken, getMessagesByConversation);
router.delete("/conversations/:id", verifyToken, deleteConversation);
router.post(
  "/create-from-chat",
  verifyToken,
  isTeacher,
  createTaskFromChat
);

export default router;