const express = require('express');
const {upload} = require("ayan-pkg")
const PlayerController = require('../../controllers/player/player.controller');



const playersRouter = express.Router();

playersRouter.get("/",PlayerController.getAllPlayers);
playersRouter.get("/:id",PlayerController.getPlayerById);
playersRouter.post("/",upload,PlayerController.createPlayer);
playersRouter.put("/:id",upload,PlayerController.updatePlayer);
playersRouter.delete("/:id",PlayerController.deletePlayer);


playersRouter.post("/first-team/:id",PlayerController.setFirstTeam);

module.exports = playersRouter;