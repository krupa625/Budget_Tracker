const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createOrUpdateBudget,
  getUserBudget,
  getList,
} = require("../controllers/budgetcontroller");
const { budgetValidationRules } = require("../validators/validators");
const validate = require("../middleware/validateResult");

router.post(
  "/set",
  budgetValidationRules,
  validate,
  authenticate,
  createOrUpdateBudget
);
router.get("/get", authenticate, getUserBudget);
router.get("/list", getList);
module.exports = router;
