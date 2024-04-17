const User = require("../../models/UserModel");

const userController = {
  // get a single user by ID
  async getUserById(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  },

  // update a user's information
  async updateUser(req, res, next) {
    try {
      const updatedUser = await User.update(req.body, {
        where: { id: req.params.id },
      });
      if (updatedUser[0] > 0) {
        // Number of affected rows
        res.status(200).json({ message: "User updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      throw new Error({ message: "User doesnt exist" + error.message });
    }
  },

  // delete a user
  async deleteUser(req, res, next) {
    try {
      const deletedUser = await User.destroy({
        where: { id: req.params.id },
      });
      if (deletedUser) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
