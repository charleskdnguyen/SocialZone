const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getUsers: [User]!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    user: User!
  }
`
