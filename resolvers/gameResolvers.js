const { getId, getFormattedDate } = require("../utils/utils");
const { Success, ServerError } = require("../utils/responses");
const { executeCypherQuery } = require("../cyphers");
const Games = require("../models").game;

const addGame = async (args) => {
  const { title, platform } = args.game;

  try {
    const game = await executeCypherQuery(
      `CREATE (game:Game {
      id: ${await getId("Game")},
      title: '${title}',
      platform: $platform
      })
      return game`,
      {platform: platform},
      true
    )

    return {
      response: {
        ...Success,
        message: "Game Added!"
      },
      game
    };
  } catch (err) {
    console.log(err.message);
    return {
      response: {
        ...ServerError
      }
    };
  }
};

const deleteGame = async (args) => {
  const { id } = args;
  try {
    const game = await executeCypherQuery(
      `MATCH (game:Game {id: ${id}}) return game`,
      {},
      true
    );

    if (!game) {
      return {
        response: {
          ...ServerError,
          message: "No Game Found!"
        }
      };
    }

    await executeCypherQuery(
      `MATCH (game:Game {id: ${id}})
      DETACH DELETE game`,
      {}
    )

    return {
      response: {
        ...Success,
        message: "Game Deleted!"
      },
      game
    };
  } catch (err) {
    console.log(err.message);
    return {
      response: {
        ...ServerError
      }
    };
  }
};

const updateGame = async (args) => {
  const { id } = args;
  const { title, platform } = args.edits;

  try {
    const game = await executeCypherQuery(
      `MATCH (game:Game {id: ${id}}) return game`,
      {},
      true
    );

    if (!game) {
      return {
        response: {
          ...ServerError,
          message: "No Game Found!"
        }
      };
    }

    const updatedGame = await executeCypherQuery(
      `MATCH (game:Game {id: ${id}})
      SET game.title = '${title}', game.platform = $platform
      RETURN game`,
      {platform: platform},
      true
    )

    return {
      response: {
        ...Success,
        message: "Game Updated!"
      },
      updatedGame
    };
  } catch (err) {
    console.log(err.message);
    return {
      response: {
        ...ServerError
      }
    };
  }
};

module.exports = {
  addGame,
  deleteGame,
  updateGame
};
