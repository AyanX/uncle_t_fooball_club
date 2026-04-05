const express= require('express');
const ProgramsController = require('../../controllers/programs/programs.controller');
const { upload } = require('ayan-pkg');
const programsRouter = express.Router();


programsRouter.get("/", ProgramsController.getAllPrograms);
programsRouter.post("/", upload ,ProgramsController.createProgram);
programsRouter.put("/:id",upload, ProgramsController.updateProgram);
programsRouter.delete("/:id", ProgramsController.deleteProgram);


module.exports= programsRouter;