const express = require('express');
const PartnersController = require('../../controllers/partners/partners.controller');
const { upload } = require('ayan-pkg');
const useAuth = require('../../utils/useAuth');
const partnersRouter = express.Router();

partnersRouter.get("/", PartnersController.getAllPartners);
partnersRouter.post("/",useAuth, upload, PartnersController.createPartner);
partnersRouter.put("/:id", useAuth, upload, PartnersController.updatePartner);
partnersRouter.delete("/:id", useAuth, PartnersController.deletePartner);

partnersRouter.get("/tiers", PartnersController.getPartnerTiers);
partnersRouter.post("/tiers", useAuth, PartnersController.createPartnerTier);
partnersRouter.put("/tiers/:id", useAuth, PartnersController.updatePartnerTier);
partnersRouter.delete("/tiers/:id", useAuth, PartnersController.deletePartnerTier);

module.exports = partnersRouter;