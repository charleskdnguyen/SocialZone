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

