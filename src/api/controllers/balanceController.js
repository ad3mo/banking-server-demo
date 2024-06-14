const Account = require("../../models/AccountModel");

const balanceController = {
  async getBalance(req, res, next) {
    try {
      const userId = req.user.id;
      const account = await Account.findOne({ where: { userId: userId } });
      if (account) {
        res
          .status(200)
          .json({ balance: account.balance, currency: account.currency });
      } else {
        throw new Error("Account not found");
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = balanceController;
