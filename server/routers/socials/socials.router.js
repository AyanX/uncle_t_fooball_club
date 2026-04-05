const express = require('express');
const SocialsController = require('../../controllers/socials/socials.controller');
const socialsRouter = express.Router();

socialsRouter.get("/", SocialsController.getSocials);
socialsRouter.put("/", SocialsController.updateSocials);

module.exports = socialsRouter;