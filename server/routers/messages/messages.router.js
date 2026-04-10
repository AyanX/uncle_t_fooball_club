const express = require("express");
const MessagesController = require("../../controllers/messages/messages.controller");
const useAuth = require("../../utils/useAuth");

const messagesRouter = express.Router();


messagesRouter.get("/", useAuth, MessagesController.getMessages)

messagesRouter.post("/", MessagesController.createMessage)

messagesRouter.delete("/:id", useAuth, MessagesController.deleteMessage)

messagesRouter.put("/read/:id", useAuth, MessagesController.markMessageAsRead)


module.exports = messagesRouter;