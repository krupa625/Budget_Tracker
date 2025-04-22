const mongoose = require("mongoose");
const InventorySchema = new mongoose.Schema({
 
  sType: { type: String, required: true, trim: true },
  sName: { type: String, required: true, trim: true },
  nQuantityAvailable: { type: Number, required: true },
  nPricePerUnit: { type: Number, required: true },
});
module.exports = mongoose.model("Inventory", InventorySchema);
