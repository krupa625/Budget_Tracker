const Expense = require("../models/Expense");
const Inventory = require("../models/Inventory");
const Budget = require("../models/Budget");
const { getSuggestions } = require("../utils/suggestion");
const { STATUS_CODES } = require("../utils/statuscode");

const createExpense = async (req, res) => {
  const items = req.body.items;
  const iUserId = req.user.id;

  try {
    const budget = await Budget.findOne({ iUserId }).populate("iUserId");
    if (!budget) {
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "Budget not set for the user" });
    }

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

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

    const fetchExpensesTotal = async (from, to) => {
      const expenseDoc = await Expense.findOne({ iUserId });
      let total = 0;

      if (expenseDoc) {
        for (const exp of expenseDoc.inventoryPurchases) {
          if (exp.dPurchaseDate >= from && exp.dPurchaseDate <= to) {
            const item = await Inventory.findById(exp.inventoryItemId);
            if (item)
              total += item.nPricePerUnit * exp.nQuantityPurchased;
          }
        }
      }

      return total;
    };

    let [totalDaily, totalWeekly, totalMonthly] = await Promise.all([
      fetchExpensesTotal(startOfDay, endOfDay),
      fetchExpensesTotal(startOfWeek, endOfWeek),
      fetchExpensesTotal(startOfMonth, endOfMonth),
    ]);


    let userExpenseDoc = await Expense.findOne({ iUserId });
    if (!userExpenseDoc) {
      userExpenseDoc = new Expense({ iUserId, inventoryPurchases: [] });
    }

    const createdExpenses = [];
    const exceedingItems = [];
    const missingItems = [];
    const insufficientItems = [];
    let totalAmountSpent = 0;

    for (const { inventoryItemId, nQuantityPurchased } of items) {
      const inventoryItem = await Inventory.findById(inventoryItemId);

      if (!inventoryItem) {
        missingItems.push(inventoryItemId);
        continue;
      }

      if (inventoryItem.nQuantityAvailable < nQuantityPurchased) {
        insufficientItems.push({
          itemName: inventoryItem.sName,
          available: inventoryItem.nQuantityAvailable,
          requested: nQuantityPurchased,
        });
        continue;
      }

      const currentExpense =
        inventoryItem.nPricePerUnit * nQuantityPurchased;

      const newDailyTotal = totalDaily + currentExpense;
      const newWeeklyTotal = totalWeekly + currentExpense;
      const newMonthlyTotal = totalMonthly + currentExpense;

      const dailyExceeded = newDailyTotal > budget.nDailyLimit;
      const weeklyExceeded = newWeeklyTotal > budget.nWeeklyLimit;
      const monthlyExceeded = newMonthlyTotal > budget.nMonthlyLimit;

      if (dailyExceeded || weeklyExceeded || monthlyExceeded) {
        exceedingItems.push({
          item: inventoryItem,
          nQuantityPurchased,
          currentExpense,
          newDailyTotal,
          newWeeklyTotal,
          newMonthlyTotal,
        });
        continue;
      }
      const expenseEntry = {
        inventoryItemId,
        nQuantityPurchased,
        dPurchaseDate: new Date(),
      };
      userExpenseDoc.inventoryPurchases.push(expenseEntry);
      createdExpenses.push(expenseEntry);

      
      inventoryItem.nQuantityAvailable -= nQuantityPurchased;
      await inventoryItem.save();

      totalDaily += currentExpense;
      totalWeekly += currentExpense;
      totalMonthly += currentExpense;
      totalAmountSpent += currentExpense;
    }

    await userExpenseDoc.save();

    if (missingItems.length > 0) {
      return res.status(STATUS_CODES.BadRequest).json({
        message: "Some items not found in inventory",
        missingItems,
        createdExpenses,
        totalAmountSpent,
      });
    }

    if (insufficientItems.length > 0) {
      return res.status(STATUS_CODES.BadRequest).json({
        message: "Some items have insufficient quantity in inventory",
        insufficientItems,
        createdExpenses,
        totalAmountSpent,
      });
    }

    if (exceedingItems.length > 0) {
      const suggestions = getSuggestions({ exceedingItems, budget });
      return res.status(STATUS_CODES.BadRequest).json({
        message: "Some items exceed your budget limits",
        suggestions,
        createdExpenses,
        totalAmountSpent,
      });
    }

    return res.status(STATUS_CODES.Create).json({
      message: "All expenses created successfully",
      createdExpenses,
      totalAmountSpent,
    });

  } catch (err) {
    console.error("Create Expense Error:", err.message);
    return res.status(STATUS_CODES.InternalServerError).json({
      error: err.message,
    });
  }
};


const softDeleteUserExpense = async (req, res) => {
  const itemId = req.params.id;
  try {
    const deletedExpense = await Expense.findByIdAndUpdate(
      itemId,
      { bIsDeleted: true },
      { new: true }
    );

    if (!deletedExpense)
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "No user expense found" });

    res
      .status(STATUS_CODES.OK)
      .json({ message: "User's Expense deleted!" });
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Server error", error: error.message });
  }
};


const getUserExpense = async (req, res) => {
  const iUserId = req.params.id;

  try {
    const expense = await Expense.find({ iUserId }).populate('iUserId').populate('inventoryItemId');
    
    
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
module.exports = { createExpense, softDeleteUserExpense, getUserExpense };
