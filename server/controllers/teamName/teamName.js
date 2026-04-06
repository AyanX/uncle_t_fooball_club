const { desc } = require("drizzle-orm");
const {db, teamNameTable} = require("../tables")


class TeamNameController {
    static async getTeamName(req, res) {
        try {
            const teamName = await db.select().from(teamNameTable).orderBy(desc(teamNameTable.created_at)).limit(1);
            return res.status(200).json({data: teamName[0], message: "Team name fetched successfully"});
        } catch (error) {
            return res.status(500).json({data: [], message: "Error fetching team name"})
        }
    }

    static async updateTeamName(req, res) {
        try {
            if(!req.body.name) {
                return res.status(400).json({data: [], message: "Team name is required"});
            }
            //insert it
            const {name} = req.body;
            await db.insert(teamNameTable).values({name: name.toUpperCase()})
            //fetch the new team name to return to client
            const teamName = await db.select().from(teamNameTable).orderBy(desc(teamNameTable.created_at)).limit(1);
            return res.status(200).json({data: teamName, message: "Team name updated successfully"});
        } catch (error) {
            return res.status(500).json({data: [], message: "Error updating team name"})
        }
    }
}



const express = require("express");
const TeamNameRouter= express.Router();


TeamNameRouter.get("/", TeamNameController.getTeamName);
TeamNameRouter.put("/", TeamNameController.updateTeamName);

module.exports = TeamNameRouter;