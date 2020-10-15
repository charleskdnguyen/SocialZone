const usersResolvers = require('./users')
const postsResolvers = require('./posts')

module.exports = {
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  }
}
