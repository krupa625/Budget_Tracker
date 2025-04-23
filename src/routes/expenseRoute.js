const express = require("express");
const {
  createExpense,
  getUserExpense,
  softDeleteUserExpense,
} = require("../controllers/expenseController");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { expenseValidationRules } = require("../validators/validators");
const validate = require("../middleware/validateResult");
router.post(
  "/add/ex",
  expenseValidationRules,
  validate,
  authenticate,
  createExpense
);
router.get("/get/:id", getUserExpense);
router.delete("/delete/:id", softDeleteUserExpense);
module.exports = router;
