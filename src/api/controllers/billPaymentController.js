const BillPayment = require("../../models/BillPaymentModel");
const Account = require("../../models/AccountModel");
const sequelize = require("../../config/db");

const billPaymentController = {
  async payBill(req, res, next) {
    const userId = req.user.id;
    const { type, description } = req.body;

    // Validate input
    if (!userId || !type) {
      return res.status(400).json({ message: "Invalid input" });
    }

    try {
      // Start a transaction
      await sequelize.transaction(async (t) => {
        // Get account
        const account = await Account.findOne({
          where: { userId: userId },
          transaction: t,
        });

        // Check if account exists
        if (!account) {
          return res.status(400).json({ message: "Account does not exist" });
        }

        // Define fixed amounts for each bill type
        let amount;
        switch (type) {
          case "gas":
            amount = BillPayment.gasAmount;
            break;
          case "electricity":
            amount = BillPayment.electricityAmount;
            break;
          case "water":
            amount = BillPayment.waterAmount;
            break;
          case "Other":
            amount = BillPayment.otherAmount;
            break;
          default:
            return res.status(400).json({ message: "Invalid bill type" });
        }

        // Check if account has enough balance
        if (account.balance < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update balance
        account.balance -= amount;
        const accountNumber = account.accountNumber;
        console.log(accountNumber);
        // Save the changes
        await account.save({ transaction: t });

        // Create bill payment record
        await BillPayment.create(
          {
            accountNumber,
            amount,
            type,
            description,
          },
          { transaction: t }
        );

        res.status(200).json({
          message: "Bill paid successfully",
          account,
        });
      });
    } catch (error) {
      console.log("emme", error.message);
      next(error);
    }
  },
  async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.id; // user id from token
      // get all user accounts (1 acc for testing purposes)
      const accounts = await Account.findAll({
        where: { userId: userId },
        attributes: ["accountNumber"],
      });

      // Extract account IDs from the accounts objects
      const accountNumbers = accounts.map((account) => account.accountNumber);

      const transactions = await BillPayment.findAll({
        where: { accountNumber: accountNumbers },
        order: [["date", "DESC"]],
      });

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = billPaymentController;
