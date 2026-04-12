const express= require('express');
const ProgramsController = require('../../controllers/programs/programs.controller');
const { upload } = require('ayan-pkg');
const useAuth = require('../../utils/useAuth');
const programsRouter = express.Router();


programsRouter.get("/", ProgramsController.getAllPrograms);
programsRouter.post("/",useAuth, upload, ProgramsController.createProgram);
programsRouter.put("/:id", useAuth, upload, ProgramsController.updateProgram);
programsRouter.delete("/:id", useAuth, ProgramsController.deleteProgram);


programsRouter.get("/:slug", ProgramsController.getProgramBySlug);

module.exports= programsRouter;