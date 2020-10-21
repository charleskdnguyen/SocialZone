import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import gql from 'graphql-tag';
import { Button, Icon, Label } from "semantic-ui-react";

function LikeButton({ user, postLikes, likeCount, id }) {
  console.log(user);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
      if (user.user && postLikes.find(like => like.likedBy.username === user.user.username)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    },
    [
      user,
      postLikes
    ]
  );

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button color='teal'>
        <Icon name='heart'/>
        Like
      </Button>
    ) : (
      <Button color='teal' basic>
        <Icon name='heart'/>
        Like
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color='teal'>
      <Icon name='heart'/>
      Like
    </Button>
  );
  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      {likeButton}
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    toggleLike(postId: $postId) {
      id
    }
  }
`;

export default LikeButton;
