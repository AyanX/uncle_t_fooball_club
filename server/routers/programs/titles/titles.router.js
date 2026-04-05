



const express= require('express');
const ProgramsController = require('../../../controllers/programs/programs.controller');
const programTitleRouter = express.Router();



//titles

programTitleRouter.get("/titles", ProgramsController.getProgramTitles);
programTitleRouter.post("/titles", ProgramsController.createProgramTitles);
programTitleRouter.put("/titles/:id", ProgramsController.updateProgramTitles);
programTitleRouter.delete("/titles/:id", ProgramsController.deleteProgramTitles);

module.exports= programTitleRouter;