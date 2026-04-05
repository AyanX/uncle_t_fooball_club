const { desc, eq } = require("drizzle-orm");
const {db, MissionVissionTable} = require("../../tables");
const { validMissionToClient, validMission } = require("../club.utils");

class MissionController{
    static async getMissions(req, res){
        try {
            const missions = await db.select().from(MissionVissionTable).where(eq(MissionVissionTable.isDeleted, false)).orderBy(desc(MissionVissionTable.created_at))
            if(!missions.length) return res.status(200).json({ data: [] , message:"No missions found."});
            return res.status(200).json({ data: validMissionToClient(missions) , message:"Missions fetched successfully."});
        } catch (error) {
            return  res.status(500).json({ message: 'An error occurred while fetching missions.' , data:[]});
        }
    }
    static async updateMissions(req, res){
        try {
            if(!req.params.id) return res.status(400).json({ message: 'Mission ID is required.' , data: [] });
            const mission = await db.select().from(MissionVissionTable).where(eq(MissionVissionTable.id, req.params.id));
            if(!mission) return res.status(404).json({ message: 'Mission not found.' , data: [] });
            if(!validMission(req.body)) return res.status(400).json({ message: 'Title and content are required to update a mission.' , data: [] });
            const { title, content } = req.body;
            await db.update(MissionVissionTable).set({ title, content }).where(eq(MissionVissionTable.id, req.params.id));

            // fetch the entry with its id
            const newEntry = await db.select().from(MissionVissionTable).where(eq(MissionVissionTable.id, req.params.id));

            return res.status(200).json({ message: 'Mission updated successfully.' , data: validMissionToClient(newEntry)  });
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while updating the mission.' , data: [] });
        }
    }
    static async deleteMissions(req, res){
        try {
            if(!req.params.id) return res.status(400).json({ message: 'Mission ID is required.' , data: [] });
            const mission = await db.select().from(MissionVissionTable).where(eq(MissionVissionTable.id, req.params.id)).first();
            if(!mission) return res.status(404).json({ message: 'Mission not found.' , data: [] });
            await db.update(MissionVissionTable).set({ isDeleted: true }).where(eq(MissionVissionTable.id, req.params.id));
            return res.status(200).json({ message: 'Mission deleted successfully.' , data: []  });
            
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while deleting the mission.' , data: [] });
        }
    }
    static async createMissions(req, res){ 
        try {
            if(!validMission(req.body)) return res.status(400).json({ message: 'Title and content are required to create a mission.' , data: [] });
            const { title, content } = req.body;


                await db.insert(MissionVissionTable).values({
                    title,
                    content
                })
       

                //fetch the last entry, new entry

                const newMission = await db.select().from(MissionVissionTable).where(eq(MissionVissionTable.isDeleted, false)).orderBy(desc(MissionVissionTable.created_at)).limit(1)
                return res.status(201).json({ message: 'Mission created successfully.' , data: validMissionToClient(newMission) });
        
          } catch (error) {
            return res.status(500).json({ message: 'An error occurred while creating the mission.' , data: [] });
        }
    }
}

module.exports = MissionController;