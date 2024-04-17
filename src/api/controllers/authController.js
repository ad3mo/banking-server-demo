const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/UserModel");
const SECRET = process.env.JWTSECRET;

const authController = {
  async register(req, res, next) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      });
      const token = jwt.sign({ id: user.id }, SECRET, {
        expiresIn: "24h",
      });
      res
        .status(201)
        .json({ message: "Signup up successfully", user: newUser, token });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const user = await User.findOne({
        where: { email: req.body.email },
      });
      if (user && (await bcrypt.compare(req.body.password, user.password))) {
        const token = jwt.sign({ id: user.id }, SECRET, {
          expiresIn: "24h",
        });
        res
          .status(200)
          .json({ message: "Logged in successfully", user, token });
      } else {
        throw new Error("Invalid credentials");
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
          .send("User not registered OR Token malfunctioned");
      }
      if (user.id !== req.user.id) {
        return res.status(401).send("Permissions didn't match");
      }
      return res
        .status(200)
        .json({ message: "OK VERIFIED", email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "ERROR", cause: error.message });
    }
  },
};

module.exports = authController;
