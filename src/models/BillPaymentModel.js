const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class BillPayment extends Model {}

BillPayment.init(
  {
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "number",
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

//  fixed amounts for each bill type
BillPayment.gasAmount = 100;
BillPayment.electricityAmount = 200;
BillPayment.waterAmount = 50;

module.exports = BillPayment;
