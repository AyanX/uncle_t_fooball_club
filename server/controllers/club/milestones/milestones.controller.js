const { eq, desc } = require("drizzle-orm");
const {db,clubMilestonesTable} = require("../../tables");
const { validMilestoneToClient, validMilestone } = require("../club.utils");

class MilestonesController {
    // Controller methods for milestones

    static async getMilestones(req, res) {
        try {
            const milestones = await db.select().from(clubMilestonesTable).where(eq (clubMilestonesTable.isDeleted, false)).orderBy(desc(clubMilestonesTable.year));
            if(milestones.length === 0) {
                return res.status(200).json({ message: "No milestones found", data:[] });
            }
            return res.status(200).json({ message: "Milestones fetched successfully", data: validMilestoneToClient(milestones) });
        } catch (error) {
            console.error("Error fetching milestones:", error);
            return res.status(500).json({ message: "Error fetching milestones", data:[] });
        }
    }

    static async createMilestone(req, res) {
        try {
            if(!validMilestone(req.body)) {
                return res.status(400).json({ message: "Invalid milestone data", data:[] });
            }

            const { title, content, year } = req.body;

            await db.insert(clubMilestonesTable).values({
                title,
                content,
                year
            })

            // fetch it and return it, last entry should be the one we just created

            const newMilestone = await db.select().from(clubMilestonesTable).where(eq(clubMilestonesTable.isDeleted, false)).orderBy(desc(clubMilestonesTable.created_at)).limit(1)

            return res.status(201).json({ message: "Milestone created successfully", data: validMilestoneToClient(newMilestone) });
        } catch (error) {
            return res.status(500).json({ message: "Error creating milestone", data:[] });
        }
    }

    static async updateMilestone(req, res) {
        try {
            if(!validMilestone(req.body)) {
                return res.status(400).json({ message: "Invalid milestone data", data:[] });
            }
            if(!req.params.id) {
                return res.status(400).json({ message: "Milestone ID is required", data:[] });
            }
            //verify it exists
            const milestone = await db.select().from(clubMilestonesTable).where(eq(clubMilestonesTable.id, req.params.id))

            if(milestone.length === 0) {
                return res.status(404).json({ message: "Milestone not found", data:[] });
            }

            const { title, content, year } = req.body;
            await db.update(clubMilestonesTable).set({ title, content, year }).where(eq(clubMilestonesTable.id, req.params.id))
            return res.status(200).json({ message: "Milestone updated successfully", validMilestoneToClient: validMilestoneToClient([{ id: req.params.id, title, content, year }]) });
        } catch (error) {
            return res.status(500).json({ message: "Error updating milestone", data:[] });
        }
    }

    static async deleteMilestone(req, res) {
        try {
            if(!req.params.id) {
                return res.status(400).json({ message: "Milestone ID is required", data:[] });
            }
            //verify it exists
            const milestone = await db.select().from(clubMilestonesTable).where(eq(clubMilestonesTable.id, req.params.id))

            if(milestone.length === 0) {
                return res.status(404).json({ message: "Milestone not found", data:[] });
            }

            await db.update(clubMilestonesTable).set({ isDeleted: true }).where(eq(clubMilestonesTable.id, req.params.id))
            return res.status(200).json({ message: "Milestone deleted successfully", data:[] });

        } catch (error) {
            return res.status(500).json({ message: "Error deleting milestone", data:[] });
        }
    }
};

module.exports = MilestonesController;