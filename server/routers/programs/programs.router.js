const express= require('express');
const ProgramsController = require('../../controllers/programs/programs.controller');
const { upload } = require('ayan-pkg');
const programsRouter = express.Router();


programsRouter.get("/", ProgramsController.getAllPrograms);
programsRouter.post("/", upload ,ProgramsController.createProgram);
programsRouter.put("/:id",upload, ProgramsController.updateProgram);
programsRouter.delete("/:id", ProgramsController.deleteProgram);

//titles

programsRouter.get("/titles", ProgramsController.getProgramTitles);
programsRouter.post("/titles", ProgramsController.createProgramTitles);
programsRouter.put("/titles/:id", ProgramsController.updateProgramTitles);
programsRouter.delete("/titles/:id", ProgramsController.deleteProgramTitles);


module.exports= programsRouter;