import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import gql from 'graphql-tag';
import { Button, Icon, Label } from "semantic-ui-react";

import MyPopup from "../util/MyPopup";
import { LIKE_POST_MUTATION } from "../util/graphql";

function LikeButton({ user, postLikes, likeCount, id }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
      if (user && postLikes.find(like => like.likedBy.username === user.username)) {
        setLiked(true);
      } else setLiked(false);
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
      <Button color="teal">
        <Icon name="heart"/>
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart"/>
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart"/>
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

export default LikeButton;
