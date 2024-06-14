const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Transfer extends Model {}

Transfer.init(
  {
    senderAccountNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "sender_account_number",
    },
    receiverAccountNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "receiver_account_number",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "TND",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
