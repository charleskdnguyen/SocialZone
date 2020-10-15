const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getUsers: [User]!
    getPost(id: ID!): Post
    getPosts: [Post!]!
  }
  
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post
    deletePost(id: ID!): Post
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
    createdAt: Date
  }

  type Post {
    id: ID!
    body: String!
    createdAt: Date
    user: User!
  }
  
  scalar Date
`
