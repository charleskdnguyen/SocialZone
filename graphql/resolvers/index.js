const { GraphQLScalarType } = require('graphql');

const usersResolvers = require('./users')
const postsResolvers = require('./posts')
const commentsResolvers = require('./comments')
const likesResolvers = require('./like')

module.exports = {
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
    ...commentsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...likesResolvers.Mutation,
  },
  Post: {
    ...postsResolvers.Post,
  },
  Comment: {
    ...commentsResolvers.Comment,
  },
  Like: {
    ...likesResolvers.Like,
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
}
