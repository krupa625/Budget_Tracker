const express = require("express");
const { createInventoryItem } = require("../controllers/inventoryController");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
router.post("/add", authenticate, createInventoryItem);
module.exports = router;
