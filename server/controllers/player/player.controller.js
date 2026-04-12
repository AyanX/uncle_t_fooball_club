const { desc, eq } = require("drizzle-orm");
const { db, player } = require("../tables");
const {
  playerHasAllRequiredFields,
  playerToClient,
  playerToDb,
  playerToClientSingle,
} = require("./players.utils");
const { generateBlurImage } = require("ayan-pkg");

class PlayerController {
  static async getAllPlayers(req, res) {
    try {
      const players = await db.select().from(player).where(eq(player.isDeleted, false)).orderBy(desc(player.created_at));

      if (!players || players.length === 0) {
        return res.status(404).json({ data: [], message: "No players found" });
      }
      const playersForClient = playerToClient(players);
      return res.status(200).json({
        data: playersForClient,
        message: "Players fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching players:", error);
      return res
        .status(500)
        .json({ data: [], message: "Internal Server Error" });
    }
  }

  static async updatePlayer(req, res) {
    try {
      if (!req.params.id) {
        return res
          .status(400)
          .json({ data: null, message: "Player ID is required" });
      }
      //fetch player, and checck isDEleted, if deleted, return not found
      const existingPlayer = await db
        .select()
        .from(player)
        .where(and(eq(player.id, parseInt(req.params.id)), eq(player.isDeleted, false)));

      if (!existingPlayer || existingPlayer.length === 0) {
        return res
          .status(404)
          .json({ data: null, message: "Player not found" });
      }

      const imageUrl = req.fileUrl || req.body.image; // Use new image URL if provided, otherwise keep existing one

      if (!imageUrl) {
        return res
          .status(400)
          .json({ data: null, message: "Player image is required" });
      }

      if (!playerHasAllRequiredFields(req.body)) {
        return res
          .status(400)
          .json({ data: null, message: "Missing required player fields" });
      }

      const playerData = playerToDb(req.body);
      playerData.image = imageUrl;
      playerData.blur_image = imageUrl;

      playerData.first_team =
        playerData.first_team === "true" || playerData.first_team === true;

      //update player data in database
      await db
        .update(player)
        .set(playerData)
        .where(eq(player.id, parseInt(req.params.id)));

      //return playerData as response

      res.status(200).json({
        data: playerToClientSingle({ ...existingPlayer[0], ...playerData }),
        message: "Player updated successfully",
      });

      //blur image
      if (!req.body.image && req.fileUrl) {
        const blurImageUrl = await generateBlurImage(imageUrl);
        if (blurImageUrl) {
          await db
            .update(player)
            .set({ blur_image: blurImageUrl })
            .where(eq(player.id, parseInt(req.params.id)));
        }
      }

      return;
    } catch (error) {
      return res
        .status(500)
        .json({ data: null, message: "Internal Server Error" });
    }
  }

  static async deletePlayer(req, res) {
    try {
        if(!req.params.id) {
            return res.status(400).json({ data: null, message: "Player ID is required" });
        }

        const existingPlayer = await db.select().from(player).where(eq(player.id, parseInt(req.params.id)));

        if (!existingPlayer || existingPlayer.length === 0) {
            return res.status(404).json({ data: null, message: "Player not found" });
        }

        await db.update(player).set({ isDeleted: true }).where(eq(player.id, parseInt(req.params.id)));

        return res.status(200).json({ data: null, message: "Player deleted successfully" });
    } catch (error) {
        return res.status(500).json({ data: null, message: "Internal Server Error" });
    }
  }

  static async createPlayer(req, res) {
    try {
      const imageUrl = req.fileUrl;

      if (!imageUrl) {
        return res
          .status(400)
          .json({ data: null, message: "Player image is required" });
      }

      if (!playerHasAllRequiredFields(req.body)) {
        return res
          .status(400)
          .json({ data: null, message: "Missing required player fields" });
      }

      const playerData = playerToDb(req.body);
      playerData.image = imageUrl;
      playerData.blur_image = imageUrl;

      playerData.first_team =
        playerData.first_team === "true" || playerData.first_team === true;

      await db.insert(player).values(playerData);

      //fetch the created player to return in response,last player in the table should be the created one
      const createdPlayer = await db
        .select()
        .from(player)
        .orderBy(desc(player.created_at))
        .limit(1);
      if (!createdPlayer || createdPlayer.length === 0) {
        return res
          .status(500)
          .json({ data: null, message: "Failed to fetch created player" });
      }

      const playerForClient = playerToClientSingle(createdPlayer[0]);

      res.status(200).json({
        data: playerForClient,
        message: "Player created successfully",
      });

      //blur image
      if (imageUrl) {
        const blurImageUrl = await generateBlurImage(imageUrl);
        if (blurImageUrl) {
          await db
            .update(player)
            .set({ blur_image: blurImageUrl })
            .where(eq(player.id, createdPlayer[0].id));
        }
      }
      return;
    } catch (error) {
      console.error("Error creating player:", error);
      return res
        .status(500)
        .json({ data: null, message: "Internal Server Error" });
    }
  }


  static async getPlayerById(req, res) {
    try {
        if(!req.params.id) {
            return res.status(400).json({ data: null, message: "Player ID is required" });
        }

        const existingPlayer = await db.select().from(player).where(eq(player.id, parseInt(req.params.id)));

        if (!existingPlayer || existingPlayer.length === 0) {
            return res.status(404).json({ data: null, message: "Player not found" });
        }

        return res.status(200).json({ data: playerToClientSingle(existingPlayer[0]), message: "Player fetched successfully" });
    } catch (error) {
        return res.status(500).json({ data: null, message: "Internal Server Error" });
    }
  }


  static async setFirstTeam(req, res) { 
    try {
      if(!req.params.id) {
        return res.status(400).json({ data: null, message: "Player ID is required" });
      }

      const existingPlayer = await db.select().from(player).where(eq(player.id, parseInt(req.params.id)));

      if (!existingPlayer || existingPlayer.length === 0) {
        return res.status(404).json({ data: null, message: "Player not found" });
      }

      await db.update(player).set({ first_team: true }).where(eq(player.id, parseInt(req.params.id)));


      //return the player that was set as first team in response

      existingPlayer[0].first_team = true;

      return res.status(200).json({ data: playerToClientSingle(existingPlayer[0]), message: "Player set as first team successfully" });
    } catch (error) {
      return res.status(500).json({ data: null, message: "Internal Server Error" });
    }
  }
}

module.exports = PlayerController;
