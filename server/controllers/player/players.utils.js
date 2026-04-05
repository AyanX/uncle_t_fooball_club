const playerToClient = (players) => {
  return players.map((player) => ({
    id: player.id,
    name: player.name,
    slug: player.slug,
    position: player.position,
    number: player.number,
    nationality: player.nationality,
    age: player.age,
    image: player.image,
    blur_image: player.blur_image,
    goals: player.goals,
    assists: player.assists,
    appearances: player.appearances,
    bio: player.bio,
    first_team: player.first_team,
    social: {
      twitter: player.social_twitter,
      instagram: player.social_instagram,
    },
  }));
};

const playerToClientSingle = (player) => {
  return {
    id: player.id,
    name: player.name,
    slug: player.slug,
    position: player.position,
    number: player.number,
    nationality: player.nationality,
    age: player.age,
    image: player.image,
    blur_image: player.blur_image,
    goals: player.goals,
    assists: player.assists,
    appearances: player.appearances,
    bio: player.bio,
    first_team: player.first_team,
    social: {
      twitter: player.social_twitter,
      instagram: player.social_instagram,
    },
  };
};

const playerToDb = (player) => {
  return {
    name: player.name,
    slug: player.slug,
    position: player.position,
    number: player.number,
    nationality: player.nationality,
    age: player.age,
    image: player.image,
    blur_image: player.blur_image,
    goals: player.goals,
    assists: player.assists,
    appearances: player.appearances,
    bio: player.bio,
    first_team: player.first_team,
    social_twitter: player.social?.twitter,
    social_instagram: player.social?.instagram,
  };
};

const playerHasAllRequiredFields = (player) => {
  const requiredFields = [
    "name",
    "slug",
    "position",
    "number",
    "nationality",
    "age",
    "goals",
    "assists",
    "appearances",
    "bio",
    "first_team",
  ];

   return requiredFields.every((field) => player[field] !== undefined && player[field] !== null);
};

module.exports = {
  playerToClient,
  playerToClientSingle,
  playerToDb,
playerHasAllRequiredFields
};
