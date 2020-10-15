const { UserInputError, AuthenticationError } = require('apollo-server-express');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Mutation: {
    likePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      const post = await context.prisma.post.findOne({
        where: {
          id: Number(postId),
        }
      });
    }
  }
}
