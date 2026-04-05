const { v4: uuidv4 }= require(  'uuid');

const validFixture = (fixture) => {
  const statusValid = ["upcoming", "live", "completed"].includes(
    fixture.status.toLowerCase(),
  );

  return (
    fixture &&
   fixture.homeTeam&&
    fixture.awayTeam&&
    fixture.date &&
    fixture.time &&
    fixture.venue &&
    fixture.competition &&
    fixture.status &&
    statusValid
  );



};

const validFixtureToClient = (fixtures) => {    
    return fixtures.map((item) => {
        return {
            id: item.id,
            homeTeam: item.homeTeam,
            awayTeam: item.awayTeam,
            date:   item.date,
            time: item.time,
            venue: item.venue,
            competition: item.competition,
            status: item.status?.toLowerCase(),
            homeScore: item.homeScore,
            awayScore: item.awayScore,
            fans: item.fans
        }
    })
}

const singleFixtureToClient = (item,id) => {
    //generate a random uuid for the fixture if it doesn't have an id 
    return {
        id: id || uuidv4(),
        homeTeam: item.homeTeam,
        awayTeam: item.awayTeam,
        date:   item.date,
        time: item.time,
        venue: item.venue,
        competition: item.competition,
        status: item.status?.toLowerCase(),
        homeScore: item.homeScore,
        awayScore: item.awayScore,
        fans: item.fans
    }
}

const validFixtureToDb = (fixture) => {
    return {
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        date: fixture.date,
        time: fixture.time,
        venue: fixture.venue,
        competition: fixture.competition,
        status: fixture.status?.toLowerCase(),
        homeScore: fixture.homeScore || 0,
        awayScore: fixture.awayScore || 0,
        fans: fixture.fans || 0
    }
}   

module.exports = {
    validFixture,
    validFixtureToClient,
    validFixtureToDb,
    singleFixtureToClient
}