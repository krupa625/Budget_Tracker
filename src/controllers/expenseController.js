const Expense = require("../models/Expense");
const Inventory = require("../models/Inventory");
const Budget = require("../models/Budget");
const { getSuggestions } = require("../utils/suggestion");
const { STATUS_CODES } = require("../utils/statuscode");

const createExpense = async (req, res) => {
  const { inventoryItemId, nQuantityPurchased } = req.body;
  const iUserId = req.user.id;

  try {
    const inventoryItem = await Inventory.findById(inventoryItemId);
    // console.log(inventoryItem);

    if (!inventoryItem) {
      return res.status(STATUS_CODES.BadRequest).json({
        message: "Inventory item not found",
      });
    }

    if (inventoryItem.nQuantityAvailable < nQuantityPurchased) {
      return res.status(STATUS_CODES.BadRequest).json({
        message: "Insufficient quantity in inventory",
      });
    }

    const budget = await Budget.findOne({ iUserId });
    // console.log(budget);

    if (!budget) {
      return res.status(STATUS_CODES.NotFound).json({
        message: "Budget not set for the user",
      });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const todayExpenses = await Expense.find({
      iUserId,
      dPurchaseDate: { $gte: startOfDay, $lte: endOfDay },
    });

    let totalSpentToday = 0;
    for (let e of todayExpenses) {
      const item = await Inventory.findById(e.inventoryItemId);
      //   console.log(item);

      if (item) {
        totalSpentToday += item.nPricePerUnit * e.nQuantityPurchased;
      }
    }
    // console.log(totalSpentToday);

    const currentExpense = inventoryItem.nPricePerUnit * nQuantityPurchased;
    // console.log(currentExpense);

    // const newTotal = totalSpentToday + currentExpense;
    // if (newTotal > budget.nDailyLimit) {
    //   const suggestions = getSuggestions();
    //   return res.status(STATUS_CODES.BadRequest).json({
    //     message: "Expense exceeds your daily budget",
    //     suggestions,
    //   });
    // }
    const expense = await Expense.create({
      iUserId,
      inventoryItemId,
      nQuantityPurchased,
      dPurchaseDate: new Date(),
    });
    inventoryItem.nQuantityAvailable -= nQuantityPurchased;
    await inventoryItem.save();
    budget.nDailyLimit -= currentExpense;
    await budget.save();
    return res.status(STATUS_CODES.Create).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (err) {
    console.error("Create Expense Error:", err.message);
    return res.status(STATUS_CODES.InternalServerError).json({
      error: err.message,
    });
  }
};
module.exports = { createExpense };
