const gql = require("graphql-tag")

const typeDefs = gql`
    type Games {
        id: ID!
        title: String!
        platform: [String!]!
        reviews: ReviewsQuery
    }
    
    type Reviews {
        id: ID!
        rating: Int!
        content: String!
        author: Authors!
        game: Games!
    }
    
    type Authors {
        id: ID!
        name: String!
        verified: Boolean!
        reviews: [Reviews!]
    }

    type GraphVisual {
        nodes: String
        relationships: String
    }

    type GamesQuery {
        games: [Games]
        graph: GraphVisual
    }

    type GameQuery {
        game: Games
        graph: GraphVisual
    }

    type ReviewsQuery {
        reviews: [Reviews]
        graph: GraphVisual
    }

    type Query {
        reviews: ReviewsQuery
        review(id: ID!): Reviews
        games: GamesQuery
        game(id: ID!): GameQuery
        authors: [Authors]
        author(id: ID!): Authors
    }

    type ServerResponse {
        code: Int!
        success: Boolean!
        message: String!
    }

    type GameMutationResponse {
        response: ServerResponse!
        game: Games
    }

    type Mutation {
        addGame(game: AddGameInput!): GameMutationResponse!
        deleteGame(id: ID!): GameMutationResponse!
        updateGame(id: ID!, edits: EditGameInput!): GameMutationResponse!
    }

    input AddGameInput {
        title: String!
        platform: [String!]!
    }

    input EditGameInput {
        title: String
        platform: [String!]
    }
`;

module.exports = typeDefs;
