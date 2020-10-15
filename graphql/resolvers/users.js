module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        const users = await context.prisma.user.findMany();
        console.log(users);

        return users;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
}
