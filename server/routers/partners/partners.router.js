const express = require('express');
const PartnersController = require('../../controllers/partners/partners.controller');
const { upload } = require('ayan-pkg');
const partnersRouter = express.Router();

partnersRouter.get("/", PartnersController.getAllPartners);
partnersRouter.post("/", upload, PartnersController.createPartner);
partnersRouter.put("/:id", upload, PartnersController.updatePartner);
partnersRouter.delete("/:id", PartnersController.deletePartner);

partnersRouter.get("/tiers", PartnersController.getPartnerTiers);
partnersRouter.post("/tiers",  PartnersController.createPartnerTier);
partnersRouter.put("/tiers/:id", PartnersController.updatePartnerTier);
partnersRouter.delete("/tiers/:id", PartnersController.deletePartnerTier);

module.exports = partnersRouter;