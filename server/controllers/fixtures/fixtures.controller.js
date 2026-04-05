const { eq, desc } = require("drizzle-orm");
const { db, fixturesTable } = require("../tables");
const {
  validFixtureToClient,
  validFixture,
  validFixtureToDb,
  singleFixtureToClient,
} = require("./fixtures.utils");

class FixturesController {
  static async getAllFixtures(req, res) {
    try {
      const allFixtures = await db
        .select()
        .from(fixturesTable)
        .where(eq(fixturesTable.isDeleted, false))
        .orderBy(desc(fixturesTable.created_at));

      if (allFixtures.length === 0) {
        return res.status(404).json({ data: [], message: "No fixtures found" });
      }
      return res.status(200).json({
        data: validFixtureToClient(allFixtures),
        message: "Fixtures retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        message: "An error occurred while fetching fixtures",
      });
    }
  }

  static async updateFixture(req, res) {
    try {
      if (!req.params.id) {
        return res
          .status(400)
          .json({ data: [], message: "Fixture ID is required" });
      }

      if (!validFixture(req.body)) {
        return res
          .status(400)
          .json({ data: [], message: "Invalid fixture data" });
      }

      // fech the existing fixture
      const existingFixture = await db
        .select()
        .from(fixturesTable)
        .where(eq(fixturesTable.id, parseInt(req.params.id)))
        .limit(1);

      if (existingFixture.length === 0) {
        return res.status(404).json({ data: [], message: "Fixture not found" });
      }

      //update the fixture
      await db
        .update(fixturesTable)
        .set(validFixtureToDb(req.body))
        .where(eq(fixturesTable.id, parseInt(req.params.id)));

     return res
        .status(200)
        .json({
          data: singleFixtureToClient(req.body, parseInt(req.params.id)),
          message: "Fixture updated successfully",
        });
    } catch (error) {
        console.error("Error updating fixture:", error);
      return   res.status(500).json({
        data: [],
        message: "An error occurred while updating the fixture",
      });
    }
  }

  static async deleteFixture(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res
          .status(400)
          .json({ data: [], message: "Fixture ID is required" });
      }

      // check if the fixture exists
      const existingFixture = await db
        .select()
        .from(fixturesTable)
        .where(eq(fixturesTable.id, parseInt(id)))
        .limit(1);

      if (existingFixture.length === 0) {
        return res.status(404).json({ data: [], message: "Fixture not found" });
      }

      // soft delete the fixture
      await db
        .update(fixturesTable)
        .set({ isDeleted: true })
        .where(eq(fixturesTable.id, parseInt(id)));

      return res
        .status(200)
        .json({ data: [], message: "Fixture deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        data: [],
        message: "An error occurred while deleting the fixture",
      });
    }
  }

  static async createFixture(req, res) {
    try {
      if (!validFixture(req.body)) {
        return res
          .status(400)
          .json({ data: [], message: "Invalid fixture data" });
      }

      const newFixtureData = validFixtureToDb(req.body);

      //insert the new fixture into the database
      await db.insert(fixturesTable).values(newFixtureData);

      //fetch the newly created fixture to return in the response, last insert
      const addedFixture = await db
        .select()
        .from(fixturesTable)
        .orderBy(desc(fixturesTable.created_at))
        .limit(1);
      return res
        .status(201)
        .json({
          data: validFixtureToClient(addedFixture)[0],
          message: "Fixture created successfully",
        });
    } catch (error) {
        console.error("Error creating fixture:", error);
      return res.status(500).json({
        data: [],
        message: "An error occurred while creating the fixture",
      });
    }
  }
}

module.exports = FixturesController;
