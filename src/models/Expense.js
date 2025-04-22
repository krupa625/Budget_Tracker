const mongoose = require("mongoose");
const ExpenseSchema = new mongoose.Schema({
  iUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
module.exports = mongoose.model("Expense", ExpenseSchema);
