const { Router } = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const accountRoutes = require("./accountRoutes");
const balanceRoutes = require("./balanceRoutes");
// const transactionRoutes = require("./transactionRoutes");
const transferRoutes = require("./transferRoutes"); // Add this line
const billRoutes = require("./billRoutes"); // Add this line

const appRouter = Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/users", userRoutes);
appRouter.use("/accounts", accountRoutes);
appRouter.use("/balance", balanceRoutes);
// appRouter.use("/transactions", transactionRoutes); // You can also uncomment this line if needed
appRouter.use("/transfer", transferRoutes); // Add this line
appRouter.use("/bill", billRoutes); // Add this line

module.exports = appRouter;
