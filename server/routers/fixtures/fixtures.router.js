const express = require('express');
const FixturesController = require('../../controllers/fixtures/fixtures.controller');
const fixturesRouter = express.Router();

fixturesRouter.get("/", FixturesController.getAllFixtures);
fixturesRouter.post("/", FixturesController.createFixture);
fixturesRouter.put("/:id", FixturesController.updateFixture);
fixturesRouter.delete("/:id", FixturesController.deleteFixture);

module.exports = fixturesRouter;