const express = require('express');
const StatsController = require('../../controllers/club/stats/stats.controller');
const MilestonesController = require('../../controllers/club/milestones/milestones.controller');
const MissionController = require('../../controllers/club/mission/mission.controller');
const ManagementController = require('../../controllers/club/management/management.controller');

const {upload} = require("ayan-pkg");
const useAuth = require('../../utils/useAuth');

const clubRouter = express.Router();


clubRouter.get("/stats",  StatsController.getStats)
clubRouter.post("/stats", useAuth, StatsController.createStats)
clubRouter.put("/stats/:id", useAuth, StatsController.updateStats)
clubRouter.delete("/stats/:id", useAuth, StatsController.deleteStats)

clubRouter.get("/milestones", MilestonesController.getMilestones)
clubRouter.post("/milestones", useAuth, MilestonesController.createMilestone)
clubRouter.put("/milestones/:id", useAuth, MilestonesController.updateMilestone)
clubRouter.delete("/milestones/:id", useAuth, MilestonesController.deleteMilestone)

clubRouter.get("/mission", MissionController.getMissions)
clubRouter.post("/mission", useAuth, MissionController.createMissions)
clubRouter.put("/mission/:id", useAuth, MissionController.updateMissions)
clubRouter.delete("/mission/:id", useAuth, MissionController.deleteMissions)

clubRouter.get("/management", ManagementController.getManagement)
clubRouter.post("/management",useAuth, upload, ManagementController.createManagement)
clubRouter.put("/management/:id",useAuth, upload, ManagementController.updateManagement)
clubRouter.delete("/management/:id", useAuth, ManagementController.deleteManagement)

module.exports = clubRouter;