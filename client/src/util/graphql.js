import gql from 'graphql-tag';

export const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      user {
        username
      }
      postLikes {
        likedBy {
          id
          username
        }
      }
      postComments {
        commentedBy {
          id
          username
        }
      }
      likeCount
      commentCount
    }
  }
`;

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id body createdAt likeCount
      user {
        id username
      }
      postLikes {
        likedBy {
          username
        }
      }
      commentCount
      postComments {
        id createdAt body
      }
    }

  }
`;

export const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      createdAt
      body
      commentedBy {
        id
        username
      }
      commentedPost {
        commentCount
      }
    }
  }
`;

export const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(id: $postId) {
      id
      body
      createdAt
      likeCount
      postComments {
        id
        commentedBy {
          id
          username
        }
        body
        createdAt
      }
      postLikes {
        likedBy {
          username
        }
      }
      commentCount
      user {
        id
        username
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(id: $postId) {
      id
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation deletePost($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId ) {
      id
      body
      user {
        id
        username
      }
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    toggleLike(postId: $postId) {
      id
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
