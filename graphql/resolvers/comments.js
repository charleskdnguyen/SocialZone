const { UserInputError, AuthenticationError } = require('apollo-server-express');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    getComments: async (_, __, context) => {
      try {
        return await context.prisma.comment.findMany() || [];
      } catch (err) {
        throw new Error(err);
      }
    },
    getComment: async (_, { id }, context) => {
      try {
        return await context.prisma.comment.findOne({
          where: {
            id: Number(id),
          }
        });
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not be empty',
          }
        });
      }

      const post = await context.prisma.post.findOne({
        where: {
          id: Number(postId),
        }
      });

      if (post) {
        const comment = await context.prisma.comment.create({
          data: {
            body,
            commentedBy: {
              connect: {
                id: user.id,
              }
            },
            commentedPost: {
              connect: {
                id: post.id,
              }
            }
          }
        });

        return comment;
      } else throw new UserInputError(('Post not found'));
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkAuth(context);

      const post = await context.prisma.post.findOne({
        where: {
          id: Number(postId),
        }
      });

      if (post) {
        const foundComment = await context.prisma.comment.findOne({
          where: {
            id: Number(commentId),
          }
        });

        if (foundComment.userId === user.id) {
          await context.prisma.comment.delete({
            where: {
              id: Number(commentId),
            }
          });

          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else throw new UserInputError('Post not found.');
    }
  },
  Comment: {
    commentedBy: async(parent, __, context) =>
      await context.prisma.comment.findOne({
        where: {
          id: parent.id,
        }
      }).commentedBy()
    ,
    commentedPost: async(parent, __, context) =>
      await context.prisma.comment.findOne({
        where: {
          id: parent.id,
        }
      }).commentedPost()
    ,
  }
};
