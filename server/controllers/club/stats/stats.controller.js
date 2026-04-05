const { desc, eq } = require("drizzle-orm");
const {db,clubStatsTable} = require("../../tables");
const { validStatToClient, validStat } = require("../club.utils");

class StatsController {
    static async getStats(req, res) {
        try {
            
            const stats = await db.select().from(clubStatsTable).where(eq(clubStatsTable.isDeleted, false)).orderBy(desc(clubStatsTable.created_at));

            if(stats.length === 0) {
                return res.status(200).json({ message: "No stats found", data:[] });
            }
            return res.status(200).json({ message: "Stats fetched successfully", data:validStatToClient(stats) });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching stats", data:[] });
        }
    }

    static async createStats(req, res) {
        try {
            if(!validStat(req.body)) {
                return res.status(400).json({ message: "Invalid stat data", data:[] });
            }
            const { label, value } = req.body;
         await db.insert(clubStatsTable).values({
                label,
                value
            })
            //fetch the latest entry stat
            const newStat = await db.select().from(clubStatsTable).where(eq(clubStatsTable.isDeleted, false)).orderBy(desc(clubStatsTable.created_at)).limit(1);

            return res.status(201).json({ message: "Stat created successfully", data:validStatToClient(newStat) });
        } catch (error) {
            return res.status(500).json({ message: "Error creating stats", data:[] });
        }
    }

    static async updateStats(req, res) {
        try {
            if(!validStat(req.body)) {
                return res.status(400).json({ message: "Invalid stat data", data:[] });
            }
            const { id } = req.params;
            if(!id){
                return res.status(400).json({ message: "Stat ID is required", data:[] });
            }

            //fetch it to confirm it exists
            const stat = await db.select().from(clubStatsTable).where(eq(clubStatsTable.id, id)).limit(1);
            if(stat.length === 0) {
                return res.status(404).json({ message: "Stat not found", data:[] });
            }

            const { label, value } = req.body;
            await db.update(clubStatsTable).set({ label, value }).where(eq(clubStatsTable.id, id));
            
            //fetch the updated stat
            const updatedStat = await db.select().from(clubStatsTable).where(eq(clubStatsTable.id, id)).limit(1)

            return res.status(200).json({ message: "Stat updated successfully", data:validStatToClient(updatedStat) });
        } catch (error) {
            return res.status(500).json({ message: "Error updating stats", data:[] });
        }
    }

    static async deleteStats(req, res) {
        try {
            const { id } = req.params;
            if(!id){
                return res.status(400).json({ message: "Stat ID is required", data:[] });
            }

            //fetch it to confirm it exists
            const stat = await db.select().from(clubStatsTable).where(eq(clubStatsTable.id, id)).limit(1);
            if(stat.length === 0) {
                return res.status(404).json({ message: "Stat not found", data:[] });
            }


            await db.update(clubStatsTable).set({ isDeleted: true }).where(eq(clubStatsTable.id, id));
            return res.status(200).json({ message: "Stat deleted successfully", data:[] });
        } catch (error) {
            console.error("error deleting stat:", error);
            return res.status(500).json({ message: "Error deleting stats", data:[] });
        }
    }
}

module.exports = StatsController;