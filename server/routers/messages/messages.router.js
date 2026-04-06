const express = require("express");
const MessagesController = require("../../controllers/messages/messages.controller");

const messagesRouter = express.Router();


messagesRouter.get("/", MessagesController.getMessages)

messagesRouter.post("/", MessagesController.createMessage)

messagesRouter.delete("/:id", MessagesController.deleteMessage)

messagesRouter.put("/read/:id", MessagesController.markMessageAsRead)


module.exports = messagesRouter;