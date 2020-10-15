const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      prisma,
      req,
    };
  }
});

const app = express();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, console.log(`Server is listening at http://localhost:4000${server.graphqlPath}`));
