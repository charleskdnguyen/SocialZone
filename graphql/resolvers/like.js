const { UserInputError, AuthenticationError } = require('apollo-server-express');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    getLikes: async (_, __, context) =>
      await context.prisma.like.findMany() || []
  },
  Mutation: {
    toggleLike: async (_, { postId }, context) => {
      const user = checkAuth(context);

      const post = await context.prisma.post.findOne({
        where: {
          id: Number(postId),
        }
      });

      if (!post) throw new UserInputError('Post not found.');

      const likesCollection = await context.prisma.like.findMany();

      const foundUserLike = likesCollection.filter(like =>
        Number(like.postId) === Number(postId) &&
        Number(like.userId) === Number(user.id)
      )[0];

      if (!foundUserLike) {
        await context.prisma.like.create({
          data: {
            likedPost: {
              connect: {
                id: post.id,
              }
            },
            likedBy: {
              connect: {
                id: user.id,
              }
            }
          }
        });
      } else {
        await context.prisma.like.delete({
          where: {
            id: foundUserLike.id,
          }
        });
      }

      return post;
    },
  },
  Like: {
    likedPost: async (parent, __, context) =>
      await context.prisma.like.findOne({
        where: {
          id: parent.id,
        }
      }).likedPost()
    ,
    likedBy: async (parent, __, context) =>
      await context.prisma.like.findOne({
        where: {
          id: parent.id,
        }
      }).likedBy(),
  }
};
