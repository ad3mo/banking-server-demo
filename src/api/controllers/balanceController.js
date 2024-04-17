const Account = require("../../models/AccountModel");

const balanceController = {
  async getBalance(req, res, next) {
    try {
      const accountId = req.user.id;
      const account = await Account.findOne({ where: { userId: accountId } });
      if (account) {
        res.status(200).json({ balance: account.balance });
      } else {
        throw new Error("Account not found");
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = balanceController;
