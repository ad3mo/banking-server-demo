const Transfer = require("../../models/TransferModel");
const Account = require("../../models/AccountModel");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const transferController = {
  async transferMoney(req, res, next) {
    const senderAccountId = req.user.id;
    const { receiverAccountId, amount } = req.body;

    // Validate input
    if (!senderAccountId || !receiverAccountId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }
    if (senderAccountId === receiverAccountId) {
      return res
        .status(400)
        .json({ message: "You can't send money to yourself" });
    }

    try {
      // Start a transaction
      const result = await sequelize.transaction(async (t) => {
        // Get sender and receiver accounts
        const senderAccount = await Account.findOne({
          where: { number: senderAccountId },
          transaction: t,
        });

        const receiverAccount = await Account.findOne({
          where: { number: receiverAccountId },
          transaction: t,
        });

        // Check if accounts exist
        if (!senderAccount || !receiverAccount) {
          return res
            .status(400)
            .json({ message: "Sender or receiver account does not exist" });
        }

        // Check if sender has enough balance
        if (senderAccount.balance < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update balances
        senderAccount.balance -= amount;
        receiverAccount.balance += amount;

        // Save the changes
        await senderAccount.save({ transaction: t });
        await receiverAccount.save({ transaction: t });

        // Create transfer record
        await Transfer.create(
          {
            senderAccountId,
            receiverAccountId,
            amount,
          },
          { transaction: t }
        );

        return { sender: senderAccount, receiver: receiverAccount };
      });

      res.status(200).json({
        message: "Transfer completed successfully",
        sender: result.sender,
        receiver: result.receiver,
      });
    } catch (error) {
      next(error);
    }
  },
  async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.id;
      // get all user accounts (1 acc for testing purposes)
      const accounts = await Account.findAll({
        where: { userId: userId },
        attributes: ["number"],
      });

      //extract account IDs from the accounts objects
      const accountIds = accounts.map((account) => account.number);

      const transactions = await Transfer.findAll({
        where: {
          [Op.or]: [
            { senderAccountId: accountIds },
            { receiverAccountId: accountIds },
          ],
        },
        order: [["date", "DESC"]],
      });

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = transferController;
