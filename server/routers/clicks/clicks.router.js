const express= require('express');
const ClickController = require('../../controllers/click/click');
const useAuth = require('../../utils/useAuth');
const clicksRouter = express.Router();

clicksRouter.post("/:id", ClickController.recordClick);

clicksRouter.get("/", useAuth, ClickController.getClickCount);

module.exports = clicksRouter;