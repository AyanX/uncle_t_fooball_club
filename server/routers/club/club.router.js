const express = require('express');
const StatsController = require('../../controllers/club/stats/stats.controller');
const MilestonesController = require('../../controllers/club/milestones/milestones.controller');
const MissionController = require('../../controllers/club/mission/mission.controller');
const ManagementController = require('../../controllers/club/management/management.controller');

const {upload} = require("ayan-pkg")

const clubRouter = express.Router();


clubRouter.get("/stats",  StatsController.getStats)
clubRouter.post("/stats", StatsController.createStats)
clubRouter.put("/stats/:id", StatsController.updateStats)
clubRouter.delete("/stats/:id", StatsController.deleteStats)

clubRouter.get("/milestones", MilestonesController.getMilestones)
clubRouter.post("/milestones", MilestonesController.createMilestone)
clubRouter.put("/milestones/:id", MilestonesController.updateMilestone)
clubRouter.delete("/milestones/:id", MilestonesController.deleteMilestone)

clubRouter.get("/mission", MissionController.getMissions)
clubRouter.post("/mission", MissionController.createMissions)
clubRouter.put("/mission/:id", MissionController.updateMissions)
clubRouter.delete("/mission/:id", MissionController.deleteMissions)

clubRouter.get("/management", ManagementController.getManagement)
clubRouter.post("/management",upload, ManagementController.createManagement)
clubRouter.put("/management/:id",upload, ManagementController.updateManagement)
clubRouter.delete("/management/:id", ManagementController.deleteManagement)

module.exports = clubRouter;