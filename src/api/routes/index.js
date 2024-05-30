const { Router } = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const accountRoutes = require("./accountRoutes");
const balanceRoutes = require("./balanceRoutes");
// const transactionRoutes = require("./transactionRoutes");
const transferRoutes = require("./transferRoutes");
const billRoutes = require("./billRoutes");

const appRouter = Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/users", userRoutes);
appRouter.use("/accounts", accountRoutes);
appRouter.use("/balance", balanceRoutes);
// appRouter.use("/transactions", transactionRoutes);
appRouter.use("/transfer", transferRoutes);
appRouter.use("/bill", billRoutes);

module.exports = appRouter;
