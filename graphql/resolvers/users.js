const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');
const { SECRET_KEY } = require('../../config');

generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, {
    expiresIn: '1h'
  });
};

module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        const users = await context.prisma.user.findMany();

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
      // validate user data
      const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Make sure user doesn't already exist
      const existingUser = await context.prisma.user.findOne({
        where: {
          username: username,
        }
      });

      // Send to front-end to show error message
      if (existingUser) throw new UserInputError('Username is taken', {
        errors: {
          username: 'This username is taken',
        }
      });

      // Hash password and create an auth token
      password = await bcrypt.hash(password, 12);
      const newUser = await context.prisma.user.create({
        data: {
          email,
          username,
          password,
        }
      });

      const token = await generateToken(newUser);

      return {
        ...newUser,
        id: newUser.id,
        token,
      };
    },
    login: async (_, {
      username, password
    }, context) => {
      const { errors, valid } = await validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await context.prisma.user.findOne({
        where: {
          username,
        }
      });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        errors.general = 'Password do not match';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = await generateToken(user);

      return {
        ...user,
        id: user.id,
        token,
      };
    }
  }
};
