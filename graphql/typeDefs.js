const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getUsers: [User]!
  }
  
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
  }
  
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    user: User!
  }
`
