import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  
  addToNotifs,
} from "../controllers/chatControllers.js";

export const chatRouter =  express.Router()

chatRouter.route("/").post(protect, accessChat)
chatRouter.route("/").get(protect, fetchChats)
chatRouter.route("/group").post(protect, createGroupChat)
chatRouter.route("/rename").put(protect, renameGroup)
chatRouter.route("/groupremove").put(protect, removeFromGroup)
chatRouter.route("/groupadd").put(protect, addToGroup)
