import React, { useContext } from 'react';
import { Card, Button, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from "../context/auth";
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from "../util/MyPopup";

function PostCard({ post: { id, createdAt, body, postLikes, likeCount, commentCount, user } }) {

  const { loggedUser } = useContext(AuthContext);

  if (loggedUser) {
    return (
      <Card fluid>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{loggedUser.username}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
          <Card.Description>
            {body}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <LikeButton {...{
            user: loggedUser,
            id: id,
            postLikes: postLikes,
            likeCount: likeCount
          }} />
          <MyPopup
            content="Comment on post"
          >
            <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
              <Button color='blue' basic>
                <Icon name='comments'/>
              </Button>
              <Label basic color='blue' pointing='left'>
                {commentCount}
              </Label>
            </Button>
          </MyPopup>
          {loggedUser && loggedUser.username === user.username && <DeleteButton postId={id}/>}
        </Card.Content>
      </Card>
    );
  } else {
    return (
      <div></div>
    );
  }
}

export default PostCard;
