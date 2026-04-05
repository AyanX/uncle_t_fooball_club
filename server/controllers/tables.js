const db = require("../db/db");

const {
 player,
  newsCategory,
  fixturesTable,
  partnersTable,
  partnerTiersTable,
    galleryTable,
    galleryCategoryTable,
    clubStatsTable,
    clubMilestonesTable,
    MissionVissionTable,
    managementTable,
    socialsTable,
    programTitlesTable,
    programsTable,
    adminLoginDetails,
    adminProfileTable,viewsTable
} = require("../models/schema");

module.exports = {
  adminLoginDetails,
  adminProfileTable,
  viewsTable,
  db,
 player,
  newsCategory,
  managementTable,
  fixturesTable,
  partnersTable,
  partnerTiersTable,
    galleryTable,
    galleryCategoryTable,
    clubStatsTable,
    clubMilestonesTable,
    MissionVissionTable,
    socialsTable,
    programTitlesTable,
    programsTable
};
