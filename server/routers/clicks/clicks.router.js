const express= require('express');
const ClickController = require('../../controllers/click/click');
const clicksRouter = express.Router();

clicksRouter.post("/:id", ClickController.recordClick);

clicksRouter.get("/", ClickController.getClickCount);

module.exports = clicksRouter;