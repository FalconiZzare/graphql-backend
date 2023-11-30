const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer: ASPDHttpServer
} = require("@apollo/server/plugin/drainHttpServer");
const typeDefs = require("./schema/schema");
const resolvers = require("./resolvers/resolvers");
const http = require("http");
const db = require("./models");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 4000;

const startServer = async () => {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ASPDHttpServer({ httpServer }),
    ]
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        token: req.header.token,
      })
    })
  );

  try {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      console.log("Apollo Server ready at /graphql");
    });
  } catch (err) {
    console.error(err);
  }
};

startServer().then(r => {})

// db.sequelize
//   .sync()
//   .then((result) => {
//     startServer().then((r) => {
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
