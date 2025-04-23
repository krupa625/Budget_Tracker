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
    if (!budget) {
      return res.status(STATUS_CODES.NotFound).json({
        message: "Budget not set for the user",
      });
    }

    const currentExpense = inventoryItem.nPricePerUnit * nQuantityPurchased;
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [dailyExpenses, weeklyExpenses, monthlyExpenses] = await Promise.all([
      Expense.find({
        iUserId,
        dPurchaseDate: { $gte: startOfDay, $lte: endOfDay },
      }),
      Expense.find({
        iUserId,
        dPurchaseDate: { $gte: startOfWeek, $lte: endOfWeek },
      }),
      Expense.find({
        iUserId,
        dPurchaseDate: { $gte: startOfMonth, $lte: endOfMonth },
      }),
    ]);

    const calcTotal = async (expenses) => {
      let total = 0;
      for (let exp of expenses) {
        const item = await Inventory.findById(exp.inventoryItemId);
        if (item) total += item.nPricePerUnit * exp.nQuantityPurchased;
      }
      return total;
    };

    const [totalDaily, totalWeekly, totalMonthly] = await Promise.all([
      calcTotal(dailyExpenses),
      calcTotal(weeklyExpenses),
      calcTotal(monthlyExpenses),
    ]);

    const dailyExceeded = totalDaily + currentExpense > budget.nDailyLimit;
    const weeklyExceeded = totalWeekly + currentExpense > budget.nWeeklyLimit;
    const monthlyExceeded =
      totalMonthly + currentExpense > budget.nMonthlyLimit;

    if (dailyExceeded || weeklyExceeded || monthlyExceeded) {
      const suggestions = getSuggestions({
        dailyExceeded,
        weeklyExceeded,
        monthlyExceeded,
        inventoryItem,
        currentExpense,
        budget,
      });

      return res.status(STATUS_CODES.BadRequest).json({
        message: "Expense exceeds your budget limit",
        suggestions,
      });
    }

    const expense = await Expense.create({
      iUserId,
      inventoryItemId,
      nQuantityPurchased,
      dPurchaseDate: now,
    });

    inventoryItem.nQuantityAvailable -= nQuantityPurchased;
    await inventoryItem.save();

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

const deleteUserExpense = async (req, res) => {
  const itemId = req.params.id;
  try {
    const deleteExpense = await Expense.findByIdAndDelete(itemId);
    if (!deleteExpense)
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "No user found" });
    res.status(STATUS_CODES.OK).json({ message: "User's Expense  Deleted !" });
  } catch (err) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Server error", error: error.message });
  }
};

const getUserExpense = async (req, res) => {
  const iUserId = req.params.id;

  try {
    const expense = await Expense.find({ iUserId });
    if (!expense)
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "No expense found" });
    res.status(STATUS_CODES.OK).json(expense);
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Server error", error: error.message });
  }
};
module.exports = { createExpense, deleteUserExpense, getUserExpense };
