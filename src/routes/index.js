const express = require("express");
const userroute = require("../routes/userroute");
const budgetroute = require("../routes/budgetRoute");
const invengtoryroute = require("../routes/inventoryRoute");
const expenseroute = require("../routes/expenseRoute");

const router = express.Router();

router.use("/", userroute, budgetroute, invengtoryroute, expenseroute);

module.exports = router;
