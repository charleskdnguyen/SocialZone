const { AuthenticationError } = require('apollo-server-express');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    getPosts: async (_, __, context) =>
      await context.prisma.post.findMany() || [],
    getPost: async (_, { id }, context) => {
      const post = await context.prisma.post.findOne({
        where: {
          id: Number(id)
        }
      }) || [];

      if (post) {
        return post;
      } else {
        throw new Error('Post not found');
      }
    }
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = await checkAuth(context);

      if (body.trim() === '') throw new Error('Post body must not be empty');

      const newPost = await context.prisma.post.create({
        data: {
          body,
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });

      await context.pubsub.publish('NEW_POST', {
        newPost,
      })

      return newPost;
    },
    deletePost: async (_, { id }, context) => {
      const user = checkAuth(context);

      const post = await context.prisma.post.findOne({
        where: {
          id: Number(id),
        }
      });

      if (user.id === post.userId) {
        await context.prisma.post.delete({
          where: {
            id: Number(id),
          }
        });
      } else {
        throw new AuthenticationError('Action not allowed');
      }

      return post;
    }
  },
  Post: {
    user: async (parent, __, context) =>
      await context.prisma.post.findOne({
        where: {
          id: parent.id
        }
      }).user()
    ,
    postComments: async (parent, __, context) =>
      await context.prisma.post.findOne({
        where: {
          id: parent.id,
        }
      }).postComments() || []
    ,
    postLikes: async (parent, __, context) =>
      await context.prisma.post.findOne({
        where: {
          id: parent.id,
        }
      }).postLikes() || []
    ,
    likeCount: async (parent, __, context) => {
      const post = await context.prisma.post.findOne({
        where: {
          id: parent.id,
        }
      });
      const allPostLikes = await context.prisma.like.findMany();

      return allPostLikes.filter(like => Number(like.postId) === Number(post.id)).length;
    }
    ,
    commentCount: async (parent, __, context) => {
      const post = await context.prisma.post.findOne({
        where: {
          id: parent.id,
        }
      });

      const allPostComments = await context.prisma.comment.findMany();

      return allPostComments.filter(comment => Number(comment.postId) === Number(post.id)).length;
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, context) => context.pubsub.asyncIterator('NEW_POST')
    }
  }
};
