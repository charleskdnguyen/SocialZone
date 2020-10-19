import React from 'react';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag';
import { Grid } from 'semantic-ui-react'

import PostCard from '../components/PostCard';

function Home() {
  const {
    loading,
    data,
  } = useQuery(FETCH_POSTS_QUERY);

  const fetchedPosts = data ? data.getPosts : null;

  return (
    <div>
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent posts</h1>
        </Grid.Row>
        <Grid.Row>
          { loading
            ? (
              <h1>Loading posts...</h1>
            )
            : (
                fetchedPosts && fetchedPosts.map(post => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post}/>
                </Grid.Column>
              ))
            )
          }
        </Grid.Row>
      </Grid>
    </div>
  )
}

const FETCH_POSTS_QUERY = gql`
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
`

export default Home;
