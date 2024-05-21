const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Account extends Model {}

Account.init(
  {
    number: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true,
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
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "TND",
    },
  },
  {
    sequelize,
    modelName: "Account",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (account) => {
        // Generate a unique account number
        account.number = await generateUniqueAccountNumber();
      },
    },
  }
);

async function generateUniqueAccountNumber() {
  let accountNumber = Math.floor(10000 + Math.random() * 90000); // genrate 5 digit acc numeber
  const existingAccount = await Account.findOne({
    where: { number: accountNumber },
  });
  // Ensure generated number is unique
  while (existingAccount) {
    accountNumber = Math.floor(10000 + Math.random() * 90000);
    existingAccount = await Account.findOne({
      where: { number: accountNumber },
    });
  }
  return accountNumber;
}

module.exports = Account;
