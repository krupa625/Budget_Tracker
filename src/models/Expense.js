const mongoose = require("mongoose");

const InventoryPurchaseSchema = new mongoose.Schema({
  inventoryItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  nQuantityPurchased: {
    type: Number,
    required: true,
  },
  dPurchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const ExpenseSchema = new mongoose.Schema({
  iUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },
  inventoryPurchases: [InventoryPurchaseSchema],
});

module.exports = mongoose.model("Expense", ExpenseSchema);
