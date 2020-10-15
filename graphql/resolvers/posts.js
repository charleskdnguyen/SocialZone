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
      });

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

      return await context.prisma.post.create({
        data: {
          body,
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })
    }
  }
};
