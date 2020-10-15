const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    getUsers: [User]!
    getPost(id: ID!): Post
    getPosts: [Post!]!
    getComment(id: ID!): Comment
    getComments: [Comment!]!
  }
  
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post
    deletePost(id: ID!): Post
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likedPost(postId: ID!): Post!
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
    postComments: [Comment!]!
    likes: [Like!]!
  }
  
  type Comment {
    id: ID!
    createdAt: Date
    body: String!
    commentedBy: User!
    commentedPost: Post!
  }
  
  type Like {
    id: ID!
    likedPost: Post!
    likedBy: User!
  }
  
  scalar Date
`
