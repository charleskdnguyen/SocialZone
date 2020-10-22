import React, { useState, useContext, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, Image, Grid, Button, Icon, Label, Form } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from "../components/LikeButton";

import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import { useMutation } from "@apollo/client";
import MyPopup from "../util/MyPopup";

function SinglePost(props) {

  const [comment, setComment] = useState('');

  const { loggedUser } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  const postId = props.match.params.postId;

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    }
  });

  const fetchedPosts = data ? data.getPost : null;

  let postMarkup;
  if (!fetchedPosts) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      user,
      postComments,
      postLikes,
      likeCount,
      commentCount
    } = fetchedPosts;

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
                  user: loggedUser,
                  id: id,
                  postLikes: postLikes,
                  likeCount: likeCount
                }} />
                <MyPopup
                  content={"Comment on post"}
                >
                  <Button as="div" labelPosition="right" onClick={() => console.log('Comment on post')}
                  >
                    <Button basic color="blue">
                      <Icon name="comments"/>
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
              </Card.Content>
            </Card>
            {loggedUser && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {postComments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {loggedUser && loggedUser.username === comment.commentedBy.username && (
                    <DeleteButton postId={id} commentId={comment.id}/>
                  )}
                  <Card.Header>{comment.commentedBy.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
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
