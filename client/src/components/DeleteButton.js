import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import gql from 'graphql-tag';
import { useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, commentId, callback }) {

  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        data.getPosts = data.getPosts.filter(post => post.id !== postId);

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data
        });
      }

      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    }
  });

  return (
    <>
      <MyPopup
        content={commentId
          ? "Delete comment"
          : "Delete post"}
      >
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }}/>
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(id: $postId) {
      id
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
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

export default DeleteButton;
