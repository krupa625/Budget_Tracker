const express = require("express");
const { createInventoryItem } = require("../controllers/inventoryController");
const router = express.Router();

const { inventoryValidationRules } = require("../validators/validators");
const validate = require("../middleware/validateResult");
router.post("/add",inventoryValidationRules,validate,  createInventoryItem);
module.exports = router;
