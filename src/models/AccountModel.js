const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Account extends Model {}

Account.init(
  {
    number: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: "Account",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Account;
