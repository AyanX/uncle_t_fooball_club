const { eq, desc } = require("drizzle-orm");
const {db,programTitlesTable,programsTable} = require("../tables");
const { validTitlesToClient, validTitle, programsToClient, validProgram,programToDb } = require("./program.utils");
const {generateBlurImage} = require("ayan-pkg")
class ProgramsController {
    //TODO data msimatch with fe
    static async getAllPrograms(req, res) {
        try {
            const programs = await db.select().from(programsTable).where(eq(programsTable.isDeleted, false)).orderBy(desc(programsTable.created_at));
            if(programs.length === 0) return res.status(200).json({ message: "No programs found", data:[] });
            return res.status(200).json({ message: "Programs fetched successfully", data:programsToClient(programs) });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching programs", data:[] });
        }
    }

    static async updateProgram(req, res) {
        try {
            if(!req.params.id) return res.status(400).json({ message: "Program id is required", data:[] });
            if(!validProgram(req.body)) return res.status(400).json({ message: "Invalid program data", data:[] });

            const image = req.fileUrl || req.body.image;

            if(!image) return res.status(400).json({ message: "Program image is required", data:[] });

            req.body.image = image;
            req.body.blur_image = image;

            await db.update(programsTable).set(programToDb(req.body)).where(eq(programsTable.id, req.params.id));

            //return the req body instead of fetch ,
            res.json(200).json({ message: "Program updated successfully", data:programsToClient([req.body]) });

             //generate blur

             const blur  = await generateBlurImage(image);
             if(blur) {
                 await db.update(programsTable).set({ blur_image: blur }).where(eq(programsTable.id, req.params.id));
             }
             return;


        } catch (error) {
            return res.status(500).json({ message: "Error updating program", data:[] });
        }
    }

    static async deleteProgram(req, res) {
        try {
            if(!req.params.id) return res.status(400).json({ message: "Program id is required", data:[] });
            if(!validProgram(req.body)) return res.status(400).json({ message: "Invalid program data", data:[] });

            //check if it exists
            const existingProgram = await db.select().from(programsTable).where(eq(programsTable.id, req.params.id));
            if(existingProgram.length < 1) return res.status(404).json({ message: "Program not found", data:[] });

            await db.update(programsTable).set({ isDeleted: true }).where(eq(programsTable.id, req.params.id));
            return res.status(200).json({ message: "Program deleted successfully", data:[] });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting program", data:[] });
        }
    }

    static async createProgram(req, res) {
        try {
            if(!validProgram(req.body)) return res.status(400).json({ message: "Invalid program data", data:[] });

            const image = req.fileUrl
            if(!image) return res.status(400).json({ message: "Program image is required", data:[] });

            req.body.image = image;
            req.body.blur_image = image;

         await db.insert(programsTable).values(programToDb(req.body));

         // fetch and return it, last entry
         const programCreated = await db.select().from(programsTable).where(eq(programsTable.isDeleted, false)).orderBy(desc(programsTable.created_at)).limit(1);
         res.status(201).json({ message: "Program created successfully", data:programsToClient(programCreated) });

            //generate blur

            const blur  = await generateBlurImage(image);
            if(blur) {
                await db.update(programsTable).set({ blur_image: blur }).where(eq(programsTable.id, programCreated[0].id));
            }
         return;



        } catch (error) {
            console.error("error making prog",error);
            return res.status(500).json({ message: "Error creating program", data:[] });
        }
    }


    //Titles go here
    static async getProgramTitles(req, res) {
        try {
            const titles = await db.select().from(programTitlesTable).where(eq(programTitlesTable.isDeleted, false));
            if(titles.length === 0) return res.status(200).json({ message: "No program titles found", data:[] });
            return res.status(200).json({ message: "Program titles fetched successfully", data: validTitlesToClient(titles) });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching program titles", data:[] });
        }
    }

    static async updateProgramTitles(req, res) {
        try {
            const id = req.params.id;
            if(!id) return res.status(400).json({ message: "Program title id is required", data:[] });
             if(!validTitle(req.body)) return res.status(400).json({ message: "Invalid program title data", data:[] });

            // check if it exists
            const existingTitle = await db.select().from(programTitlesTable).where(eq(programTitlesTable.id, id));
            if(existingTitle.length < 1) return res.status(404).json({ message: "Program title not found", data:[] });
            
            await db.update(programTitlesTable).set({ title: req.body.title.toLowerCase() }).where(eq(programTitlesTable.id, id));

            return res.status(200).json({ message: "Program title updated successfully", data:validTitlesToClient([req.body]) });



        } catch (error) {
            return res.status(500).json({ message: "Error updating program title", data:[] });
        }
    }
    static async deleteProgramTitles(req, res) {
        try {
            if(!req.params.id) return res.status(400).json({ message: "Program title id is required", data:[] });
            if(!validTitle(req.body)) return res.status(400).json({ message: "Invalid program title data", data:[] });

            //check if it exists
            const existingTitle = await db.select().from(programTitlesTable).where(eq(programTitlesTable.id, req.params.id));
            if(!existingTitle) return res.status(404).json({ message: "Program title not found", data:[] });

            await db.update(programTitlesTable).set({ isDeleted: true }).where(eq(programTitlesTable.id, req.params.id));
            return res.status(200).json({ message: "Program title deleted successfully", data:validTitlesToClient([req.body]) });

        } catch (error) {
            return res.status(500).json({ message: "Error deleting program title", data:[] });
        }
    }
    static async createProgramTitles(req, res) {
        try {
            if(!validTitle(req.body)) return res.status(400).json({ message: "Invalid program title data", data:[] });

            // check if it exists
            const existingTitle = await db.select().from(programTitlesTable).where(eq(programTitlesTable.title, req.body.title));
            if(existingTitle.length > 0) return res.status(400).json({ message: "Program title already exists", data:[] });
            
             await db.insert(programTitlesTable).values({
                title: req.body.title.toLowerCase()
            })
            // fetch and return it, last entry

            const newTitle = await db.select().from(programTitlesTable).orderBy(desc(programTitlesTable.created_at)).limit(1);

            return res.status(201).json({ message: "Program title created successfully", data:validTitlesToClient(newTitle) });
        } catch (error) {
            return res.status(500).json({ message: "Error creating program title", data:[] });
        }
    }
}


module.exports = ProgramsController;