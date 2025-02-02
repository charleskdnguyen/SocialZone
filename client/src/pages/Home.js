import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition, TransitionGroup } from 'semantic-ui-react';

import { AuthContext } from "../context/auth";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
  const user = useContext(AuthContext);

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
          {user && (
            <Grid.Column>
              <PostForm/>
            </Grid.Column>
          )}
          {loading
            ? (
              <h1>Loading posts...</h1>
            )
            : (
              <TransitionGroup>
                {fetchedPosts &&
                fetchedPosts.map(post => (

                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post}/>
                  </Grid.Column>
                ))}
              </TransitionGroup>
            )
          }
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
