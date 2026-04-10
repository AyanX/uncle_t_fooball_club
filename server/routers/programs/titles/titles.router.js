



const express= require('express');
const ProgramsController = require('../../../controllers/programs/programs.controller');
const useAuth = require('../../../utils/useAuth');
const programTitleRouter = express.Router();



//titles

programTitleRouter.get("/titles", ProgramsController.getProgramTitles);
programTitleRouter.post("/titles",useAuth, ProgramsController.createProgramTitles);
programTitleRouter.put("/titles/:id", useAuth, ProgramsController.updateProgramTitles);
programTitleRouter.delete("/titles/:id", useAuth, ProgramsController.deleteProgramTitles);

programTitleRouter.get("/titles/unused", ProgramsController.clientProgramUnusedTitles)

module.exports= programTitleRouter;