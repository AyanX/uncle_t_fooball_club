const { desc, eq } = require("drizzle-orm");
const {db, player} = require ("../tables")
const {playerHasAllRequiredFields,playerToClient,playerToDb,playerToClientSingle} = require("./players.utils")
const {generateBlurImage} = require("ayan-pkg")

// TODO : add validation for player data, add pagination for get all players, add get player by id, add search players by name or position
class PlayerController {
    static async getAllPlayers(req, res) {
        try {
            const players = await db.select().from(player);

            if(!players || players.length === 0) {
                return res.status(404).json({data: [], message: "No players found"});
            }
            const playersForClient = playerToClient(players);
            return res.status(200).json({data: playersForClient, message: "Players fetched successfully"});
        } catch (error) {
            console.error("Error fetching players:", error);
           return  res.status(500).json({data: [], message: "Internal Server Error"});
        }
    }

    static async updatePlayer(req, res) {
        return
    }


    static async deletePlayer(req, res) {}

    static async createPlayer(req, res) {
    try {
        const imageUrl = req.fileUrl;


        console.log(req.body);

        if(!playerHasAllRequiredFields(req.body)) {
            return res.status(400).json({data: null, message: "Missing required player fields"});
        }

         const playerData = playerToDb(req.body);
         playerData.image = imageUrl;
         playerData.blur_image = imageUrl;

        await db.insert(player).values(playerData);

        //fetch the created player to return in response,last player in the table should be the created one
        const createdPlayer = await db.select().from(player).orderBy(desc(player.created_at)).limit(1);
        if(!createdPlayer || createdPlayer.length === 0) {
            return res.status(500).json({data: null, message: "Failed to fetch created player"});
        }

        const playerForClient = playerToClientSingle(createdPlayer[0]);

        res.status(200).json({data: playerForClient, message: "Player created successfully"});

        //blur image  
        if(imageUrl) {
            const blurImageUrl = await generateBlurImage(imageUrl);
            if(blurImageUrl) {
                await db.update(player).set({blur_image: blurImageUrl}).where(eq(player.id ,createdPlayer[0].id));
            }
            return;
        }
        return;
    } catch (error) {
        console.error("Error creating player:", error);
        return res.status(500).json({data: null, message: "Internal Server Error"});
    }}
}

module.exports = PlayerController;