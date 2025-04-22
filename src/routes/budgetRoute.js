const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createOrUpdateBudget,
  getUserBudget,
} = require("../controllers/budgetcontroller");

router.post("/set", authenticate, createOrUpdateBudget);
router.get("/get", authenticate, getUserBudget);
module.exports = router;
