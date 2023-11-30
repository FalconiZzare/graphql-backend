const { addGame, deleteGame, updateGame } = require("./gameResolvers");
const { executeCypherQuery } = require("../cyphers");

const resolvers = {
  Query: {
    async games() {
      const { data, nodes, relationships } = await executeCypherQuery(
        `MATCH (games:Game) RETURN games`,
        {}
      );

      return {
        games: data,
        graph: {
          nodes: JSON.stringify(nodes),
          relationships: JSON.stringify(relationships)
        }
      };

    },
    async game(_, args) {
      const { data, nodes, relationships } = await executeCypherQuery(
        `MATCH (game:Game {id: ${args.id}}) RETURN game`,
        {},
        true
      );

      return {
        game: data,
        graph: {
          nodes: JSON.stringify(nodes),
          relationships: JSON.stringify(relationships)
        }
      };
    },
    async reviews() {
      const { data, nodes, relationships } = await executeCypherQuery(
        `MATCH (reviews:Review) RETURN reviews`,
        {}
      );

      return {
        reviews: data,
        graph: {
          nodes: JSON.stringify(nodes),
          relationships: JSON.stringify(relationships)
        }
      };
    },
    async review(_, args) {
      const { data } = await executeCypherQuery(
        `MATCH (review:Review {id: ${args.id}}) RETURN review`,
        {},
        true
      );

      return data;
    },
    async authors() {
      const { data } = executeCypherQuery(
        `MATCH (authors:Author) RETURN authors`,
        {}
      );

      return data;
    },
    async author(_, args) {
      const { data } = executeCypherQuery(
        `MATCH (author:Author {id: ${args.id}}) RETURN author`,
        {},
        true
      );

      return data;
    }
  },
  Games: {
    async reviews(parent) {
      const { data, nodes, relationships } = await executeCypherQuery(
        `MATCH (reviews:Review) -[rel:REVIEWS]-> (game:Game {id: ${parent.id}})
        RETURN reviews, rel, game
        `,
        {}
      );

      return {
        reviews: data,
        graph: {
          nodes: JSON.stringify(nodes),
          relationships: JSON.stringify(relationships)
        }
      };
    }
  },
  Authors: {
    async reviews(parent) {
      const { data } = await executeCypherQuery(
        `MATCH (reviews:Review) <-[:WROTE]- (author:Author {id: ${parent.id}})
        RETURN reviews
        ORDER BY reviews.rating DESC
        `,
        {}
      );

      return data;
    }
  },
  Reviews: {
    async author(parent) {
      const { data } = await executeCypherQuery(
        `MATCH (review:Review {id: ${parent.id}}) <-[:WROTE]- (author:Author)
        RETURN author`,
        {},
        true
      );

      return data;
    },
    async game(parent) {
      const { data } = await executeCypherQuery(
        `MATCH (review:Review {id: ${parent.id}}) -[:REVIEWS]-> (game:Game)
        RETURN game`,
        {},
        true
      );

      return data;
    }
  },
  Mutation: {
    deleteGame(_, args) {
      return deleteGame(args);
    },

    addGame(_, args) {
      return addGame(args);
    },

    updateGame(_, args) {
      return updateGame(args);
    }
  }
};

module.exports = resolvers;
