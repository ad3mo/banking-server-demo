const Transaction = require("../../models/TransactionModel");
const Account = require("../../models/AccountModel");
const sequelize = require("../../config/db");

const transactionController = {
  async sendMoney(req, res, next) {
    const senderId = req.user.id;
    const { accountNumber, amount } = req.body;

    // Validate input
    if (!accountNumber) {
      return res
        .status(400)
        .json({ message: "Receiver account number is required" });
    }
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "The minimum amount to send is 1 " });
    }
    // // Check if sender and receiver are the same
    // if (senderId == accountNumber) {
    //   return res
    //     .status(400)
    //     .json({ message: "Cannot send money to your own account" });
    // }

    try {
      // start a transaction
      const result = await sequelize.transaction(async (t) => {
        // lock the sender's and receiver's account rows for update
        const senderAccount = await Account.findOne(
          { where: { userId: senderId } },
          { transaction: t, lock: true }
        );

        const receiverAccount = await Account.findOne(
          { where: { number: accountNumber } },
          { transaction: t, lock: true }
        );
        //check if receiver account exist
        if (!receiverAccount) {
          throw new Error("Reciever ID does not exist");
        }
        //check if sender account is the same as receiver account

        if (senderAccount.number == accountNumber) {
          return res
            .status(400)
            .json({ message: "Cannot send money to your own account" });
        }

        // Check if sender has enough balance
        if (senderAccount.balance < amount) {
          throw new Error("Not enough balance");
        }

        // udate balances
        senderAccount.balance -= amount;
        receiverAccount.balance += amount;

        // save the changes
        await senderAccount.save({ transaction: t });
        await receiverAccount.save({ transaction: t });

        // create transaction records
        await Transaction.create(
          {
            accountId: senderAccount.number,
            type: "send",
            amount: -amount,
          },
          { transaction: t }
        );

        await Transaction.create(
          {
            accountId: receiverAccount.number,
            type: "receive",
            amount,
          },
          { transaction: t }
        );

        return { sender: senderAccount, receiver: receiverAccount };
      });

      res.status(200).json({
        message: "Transaction completed successfully",
        sender: result.sender,
        receiver: result.receiver,
      });
    } catch (error) {
      next(error);
    }
  },

  async payBill(req, res, next) {
    const userId = req.user.id;
    const billAmount = 100; // assuing bills always 100$

    try {
      // start a transaction
      const result = await sequelize.transaction(async (t) => {
        // lock the user's account row for update
        const userAccount = await Account.findOne(
          { where: { userId: userId } },
          { transaction: t, lock: true }
        );

        // check if user has enough balance to pay the bill
        if (userAccount.balance < billAmount) {
          throw new Error("Not enough balance to pay the bill");
        }

        // substract the bill amount from the user's account
        userAccount.balance -= billAmount;

        // save the changes
        await userAccount.save({ transaction: t });

        //create a transaction record for the bill payment
        await Transaction.create(
          {
            accountId: userAccount.number,
            type: "bill_payment",
            amount: -billAmount,
          },
          { transaction: t }
        );

        return userAccount;
      });

      res.status(200).json({
        message: "Bill paid successfully",
        account: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.id; // user id from token
      // get all user accounts (1 acc for testing purposes)
      const accounts = await Account.findAll({
        where: { userId: userId },
        attributes: ["number"],
      });

      // Extract the account IDs from the accounts objects
      const accountIds = accounts.map((account) => account.number);

      const transactions = await Transaction.findAll({
        where: { accountId: accountIds },
        order: [["date", "DESC"]],
      });

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = transactionController;
