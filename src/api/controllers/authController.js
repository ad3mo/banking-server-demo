const User = require("../../models/UserModel");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (id) => {
  secret = process.env.JWT_SECRET;
  return jwt.sign({ id }, secret, {
    expiresIn: "24h",
  });
};

const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      //check if user exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User with the same username or email already exists",
        });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email is not valid" });
      }

      // if (!validator.isStrongPassword(password)) {
      //   return res.status(400).json({ message: "Password is not strong" });
      // }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username: username,
        password: hashedPassword,
        email: email,
      });
      const token = createToken(newUser.id);
      res.status(201).json({ email, username, token });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email: email },
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = createToken(user.id);
        res.status(200).json({ email, username: user.username, token });
      } else {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      next(error);
    }
  },

  async verifyUser(req, res, next) {
    try {
      //user token check
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res
          .status(401)
          .json({ message: "User not registered OR Token malfunctioned" });
      }
      if (user.id !== req.user.id) {
        return res.status(401).json({ message: "Permissions didn't match" });
      }
      return res
        .status(200)
        .json({ message: "success : User exists", email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "ERROR", cause: error.message });
    }
  },
};

module.exports = authController;
