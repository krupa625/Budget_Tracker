const express = require("express");
const { createExpense } = require("../controllers/expenseController");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { expenseValidationRules } = require("../validators/validators");
const validate = require("../middleware/validateResult");
router.post("/add/ex",expenseValidationRules,validate,authenticate, createExpense);
module.exports = router;
