const express = require('express');
const FixturesController = require('../../controllers/fixtures/fixtures.controller');
const useAuth = require('../../utils/useAuth');
const fixturesRouter = express.Router();

fixturesRouter.get("/", FixturesController.getAllFixtures);
fixturesRouter.post("/", useAuth, FixturesController.createFixture);
fixturesRouter.put("/:id", useAuth, FixturesController.updateFixture);
fixturesRouter.delete("/:id", useAuth, FixturesController.deleteFixture);

module.exports = fixturesRouter;