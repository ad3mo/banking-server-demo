const Transfer = require("../../models/TransferModel");
const Account = require("../../models/AccountModel");
const sequelize = require("../../config/db");
const { Op } = require("sequelize");
const transferController = {
  async transferMoney(req, res, next) {
    const userId = req.user.id;
    const { receiverAccountNumber, amount } = req.body;
    console.log(userId);
    console.log(receiverAccountNumber);

    const senderAccount = await Account.findOne({
      where: { userId: userId },
    });
    const senderAccountNumber = senderAccount.accountNumber;
    console.log(senderAccountNumber);

    // Convert receiverAccountId to a number
    const receiverAccNumber = Number(receiverAccountNumber);

    // Convert amount to a number
    const amountNumber = Number(amount);

    // Check if the conversion was successful (Optional)
    if (isNaN(receiverAccNumber) || isNaN(amountNumber)) {
      return res
        .status(400)
        .send(
          "Invalid input: receiverAccountId and amount should be valid numbers."
        );
    }

    // Validate input
    if (!senderAccountNumber || !receiverAccNumber || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }
    if (senderAccountNumber === receiverAccNumber) {
      return res
        .status(400)
        .json({ message: "You can't send money to yourself" });
    }

    try {
      // Start a transaction
      const result = await sequelize.transaction(async (t) => {
        // Get sender and receiver accounts

        const receiverAccount = await Account.findOne({
          where: { accountNumber: receiverAccNumber },
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
        console.log(receiverAccount.accountNumber);
        // Create transfer record
        await Transfer.create(
          {
            senderAccountNumber: senderAccount.accountNumber,
            receiverAccountNumber: receiverAccNumber,
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
        attributes: ["accountNumber"],
      });

      //extract account IDs from the accounts objects
      const accountIds = accounts.map((account) => account.accountNumber);

      const transactions = await Transfer.findAll({
        where: {
          [Op.or]: [
            { senderAccountNumber: accountIds },
            { receiverAccountNumber: accountIds },
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
