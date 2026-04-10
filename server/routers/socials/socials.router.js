const express = require('express');
const SocialsController = require('../../controllers/socials/socials.controller');
const useAuth = require('../../utils/useAuth');
const socialsRouter = express.Router();

socialsRouter.get("/", SocialsController.getSocials);
socialsRouter.put("/", useAuth, SocialsController.updateSocials);

module.exports = socialsRouter;