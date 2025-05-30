const Inventory = require("../models/Inventory");
const { STATUS_CODES } = require("../utils/statuscode");
const createInventoryItem = async (req, res) => {
  const { sType, sName, nQuantityAvailable, nPricePerUnit } = req.body;
  const existingInventory = await Inventory.findOne(
    { sType, sName },
    { _id: 1 }
  );
  if (existingInventory) {
    return res
      .status(STATUS_CODES.BadRequest)
      .json({ message: "Inventory already exists" });
  }

  try {
    const item = await Inventory.create({
      sType,
      sName,
      nQuantityAvailable,
      nPricePerUnit,
    });
    return res
      .status(STATUS_CODES.Create)
      .json({ message: "Item added", item });
  } catch (error) {
    return res
      .status(STATUS_CODES.InternalServerError)
      .json({ error: error.message });
  }
};

module.exports = { createInventoryItem };
