const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  mapErrorToResponse,
} = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

// POST /signup - creates a new user
function createUser(req, res) {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(STATUS_CODES.CREATED).json(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(STATUS_CODES.CONFLICT)
          .json({ message: ERROR_MESSAGES.DUPLICATE_ENTRY });
      }
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

// POST /signin - login
function login(req, res) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(STATUS_CODES.OK).json({ token });
    })
    .catch((err) => {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

// GET /users/me - returns current user
function getCurrentUser(req, res) {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(STATUS_CODES.OK).json(user))
    .catch((err) => {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

// PATCH /users/me - updates current user
function updateUser(req, res) {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(STATUS_CODES.OK).json(user))
    .catch((err) => {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
