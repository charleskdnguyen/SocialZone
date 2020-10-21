import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, Image, Grid, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from "../components/LikeButton";

import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {

  const { user } = useContext(AuthContext);

  const postId = props.match.params.postId;

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  const fetchedPosts = data ? data.getPost : null;

  let postMarkup;
  if (!fetchedPosts) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    const { id, body, createdAt, postComments, postLikes, likeCount, commentCount } = fetchedPosts;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>fdsa</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr/>
              <Card.Content extra>
                <LikeButton {...{
                  user: user,
                  id: id,
                  postLikes: postLikes,
                  likeCount: likeCount
                }} />
                <Button as="div" labelPosition="right" onClick={() => console.log('Comment on post')}
                >
                  <Button basic color="blue">
                    <Icon name="comments"/>
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {/*{user && user.username === postComments.commentedBy.username && (*/}
                {/*  <DeleteButton postId={id} callback={deletePostCallback}/>*/}
                {/*)}*/}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const FETCH_POST_QUERY = gql`
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

export default SinglePost;
