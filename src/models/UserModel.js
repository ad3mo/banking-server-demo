const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Assuming you have a db.js file in your config folder for the Sequelize connection

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
    underscored: true,
  }
);

module.exports = User;
