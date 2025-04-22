const express = require("express");
const { createExpense } = require("../controllers/expenseController");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
router.post("/add/ex", authenticate, createExpense);
module.exports = router;
