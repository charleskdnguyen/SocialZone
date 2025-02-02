const { ApolloServer, PubSub } = require('apollo-server-express');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors')
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');

const prisma = new PrismaClient();

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      prisma,
      req,
      pubsub
    };
  },
});

const app = express();

app.use(cors())

server.applyMiddleware({ app });

app.listen(
  { port: 5000 },
  console.log(`Server is listening at http://localhost:5000${server.graphqlPath}`));
