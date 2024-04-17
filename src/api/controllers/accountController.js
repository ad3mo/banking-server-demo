const Account = require("../../models/AccountModel");

const accountController = {
  // create a new account for a user
  async createAccount(req, res, next) {
    try {
      const newAccount = await Account.create({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(newAccount);
    } catch (error) {
      next(error);
    }
  },

  // get account details (creating 1 accout for testing purposes)
  async getAccountDetails(req, res, next) {
    try {
      const account = await Account.findOne({ where: { userId: req.user.id } });
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    } catch (error) {
      next(error);
    }
  },

  // update account details
  async updateAccount(req, res, next) {
    try {
      const updatedAccount = await Account.update(req.body, {
        where: { userId: req.user.id },
      });
      if (updatedAccount[0] > 0) {
        res.status(200).json({ message: "Account updated successfully" });
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = accountController;
