const { STATUS_CODES } = require("../utils/statuscode");
const Budget = require("../models/Budget");

const createOrUpdateBudget = async (req, res) => {
  const { nDailyLimit, nWeeklyLimit, nMonthlyLimit } = req.body;
  const iUserId = req.user.id;
  if (nDailyLimit <= 0 || nWeeklyLimit <= 0 || nMonthlyLimit <= 0) {
    return res.status(STATUS_CODES.BadRequest).json({
      message: "All limits must be greater than zero.",
    });
  }
  if (nDailyLimit > nWeeklyLimit) {
    return res.status(STATUS_CODES.BadRequest).json({
      message: "Daily limit should not exceed weekly limit.",
    });
  }
  if (nWeeklyLimit > nMonthlyLimit) {
    return res.status(STATUS_CODES.BadRequest).json({
      message: "Weekly limit should not exceed monthly limit.",
    });
  }
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
  try {
    const existingBudget = await Budget.findOne({
      iUserId,
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    });
    if (existingBudget) {
      return res.status(STATUS_CODES.BadRequest).json({
        message: "Budget for this month already exists.",
      });
    }
    await Budget.deleteMany({ iUserId });
    const newBudget = await Budget.create({
      iUserId,
      nDailyLimit,
      nWeeklyLimit,
      nMonthlyLimit,
      createdAt: now,
    });
    return res.status(STATUS_CODES.Create).json({
      message: "Monthly budget created successfully.",
      budget: newBudget,
    });
  } catch (error) {
    return res.status(STATUS_CODES.InternalServerError).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserBudget = async (req, res) => {
  const iUserId = req.user.id;

  try {
    const budget = await Budget.findOne({ iUserId }).populate("iUserId");
    if (!budget)
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "No budget found" });
    res.status(STATUS_CODES.OK).json(budget);
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Server error", error: error.message });
  }
};

const getList = async (req, res) => {
  try {
    const budget = await Budget.find({}).populate("iUserId");
    const budgetnew = await Budget.find({}).populate("oUser");
    console.log(budgetnew);

    if (!budget)
      return res
        .status(STATUS_CODES.NotFound)
        .json({ message: "No budget found" });
    res.status(STATUS_CODES.OK).json({ budget, budgetnew });
  } catch (error) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  createOrUpdateBudget,
  getUserBudget,
  getList,
};
