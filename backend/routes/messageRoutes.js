import express from "express"

import {
  allMessages,
  sendMessage,
} from "../controllers/messageControllers.js";
import { protect } from "../middleware/authMiddleware.js";

export const messageRouter = express.Router();

messageRouter.route("/:chatId").get(protect, allMessages);
messageRouter.route("/").post(protect, sendMessage);
