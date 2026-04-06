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
    clicksTable,
    newsTable,
    programTitlesTable,
    programsTable,
    adminLoginDetails,
    messagesTable,
    adminProfileTable,viewsTable,teamNameTable
} = require("../models/schema");

module.exports = {
  adminLoginDetails,
  clicksTable,
  teamNameTable,
  messagesTable,
  adminProfileTable,
  viewsTable,
  db,
  newsTable,
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
