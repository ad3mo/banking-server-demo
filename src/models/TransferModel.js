const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Transfer extends Model {}

Transfer.init(
  {
    senderAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Transfer",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Transfer;
