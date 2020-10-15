const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express')

const { SECRET_KEY } = require('../../config')

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
  },
  Mutation: {
    register: async (_, {
      registerInput: {
        username, email, password, confirmPassword
      }
    }, context) => {

      //! validate user data

      //! Make sure user doesn't already exist


      // Hash password and create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = await context.prisma.user.create({
        data: {
          email,
          username,
          password,
        }
      });

      const token = await jwt.sign({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      }, SECRET_KEY, {
        expiresIn: '1h'
      });

      return {
        ...newUser,
        id: newUser.id,
        token,
      };
    }
  }
};
