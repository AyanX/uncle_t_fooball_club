// const dummyViews = [
//   { id: 1, newsId: 1, views: 1540 }, { id: 2, newsId: 2, views: 892 },
//   { id: 3, newsId: 3, views: 643 },  { id: 4, newsId: 4, views: 412 },
//   { id: 5, newsId: 5, views: 310 },  { id: 6, newsId: 6, views: 198 },
// ];
const { eq } = require("drizzle-orm");
const {db,clicksTable} = require("../tables")

class ClickController {
    static async recordClick(req, res) {
      const {id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }

        try {
            
            // Check if a click record already exists for the given newsId
            const existingClick = await db.select().from(clicksTable).where(eq(clicksTable.newsId, id)).limit(1);

            if (existingClick.length > 0) {
                // If a record exists, increment the click count
                const updatedClicks = existingClick[0].views + 1;
                await db.update(clicksTable).set({ views: updatedClicks }).where(eq(clicksTable.newsId, id));
            } else {
                // If no record exists, create a new one with views set to 1
                await db.insert(clicksTable).values({ newsId: id, views: 1 });
            }
            return res.status(200).json({ message: "Click recorded successfully" });
        } catch (error) {
            console.error("Error recording click:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }


    static async getClickCount(req, res) {
        try {
            const clicks = await db.select().from(clicksTable).where(eq(clicksTable.isDeleted, false));
            return res.status(200).json({ message: "Click counts retrieved successfully", data: clicks });
            
        } catch (error) {
            console.error("Error getting click count:", error);
            return res.status(500).json({ message: "Internal server error", data:[] });
        }
    }
}

module.exports = ClickController;