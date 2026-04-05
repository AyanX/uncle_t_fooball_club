const express = require('express');
const {upload} = require("ayan-pkg")
const PlayerController = require('../../controllers/player/player.controller');



const playersRouter = express.Router();

playersRouter.get("/",PlayerController.getAllPlayers);
playersRouter.post("/",upload,PlayerController.createPlayer);
playersRouter.put("/:id",PlayerController.updatePlayer);
playersRouter.delete("/:id",PlayerController.deletePlayer);



module.exports = playersRouter;