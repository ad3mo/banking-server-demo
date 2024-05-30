const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class BillPayment extends Model {}

BillPayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accountNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "account_number",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("gas", "electricity", "water"),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "TND",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "BillPayment",
    timestamps: true,
    underscored: true,
  }
);

function getRandomPrice(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

BillPayment.gasAmount = getRandomPrice(15, 250);
BillPayment.electricityAmount = getRandomPrice(50, 250);
BillPayment.waterAmount = getRandomPrice(30, 100);

module.exports = BillPayment;
