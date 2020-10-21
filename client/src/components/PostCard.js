import React, { useContext } from 'react';
import { Card, Button, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from "../context/auth";
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

function PostCard(props) {
  const user = useContext(AuthContext);
  console.log(user);
  console.log(props);
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{user.user.username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${props.post.id}`}>{moment(props.post.createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          {props.post.body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton {...{
          user: user,
          id: props.post.id,
          postLikes: props.post.postLikes,
          likeCount: props.post.likeCount
        }} />
        <Button labelPosition='right' as={Link} to={`/posts/${props.id}`}>
          <Button color='blue' basic>
            <Icon name='comments'/>
          </Button>
          <Label basic color='blue' pointing='left'>
            {props.post.commentCount}
          </Label>
        </Button>
        {user.user && user.user.username === props.post.user.username && <DeleteButton postId={props.post.id}/>}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
