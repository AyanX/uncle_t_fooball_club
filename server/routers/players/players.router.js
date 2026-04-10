const express = require('express');
const {upload} = require("ayan-pkg")
const PlayerController = require('../../controllers/player/player.controller');
const useAuth = require('../../utils/useAuth');



const playersRouter = express.Router();

playersRouter.get("/",PlayerController.getAllPlayers);
playersRouter.get("/:id",PlayerController.getPlayerById);
playersRouter.post("/", useAuth, upload,PlayerController.createPlayer);
playersRouter.put("/:id", useAuth, upload,PlayerController.updatePlayer);
playersRouter.delete("/:id", useAuth, PlayerController.deletePlayer);


playersRouter.post("/first-team/:id", useAuth, PlayerController.setFirstTeam);

module.exports = playersRouter;