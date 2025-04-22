const { STATUS_CODES } = require("../utils/statuscode");
const Budget = require("../models/Budget");

const createOrUpdateBudget = async (req, res) => {
  const { nDailyLimit, nWeeklyLimit, nMonthlyLimit } = req.body;
  const iUserId = req.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  try {
    const existingBudget = await Budget.findOne({
      iUserId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    if (existingBudget) {
      return res.status(STATUS_CODES.BadRequest).json({
        message:
          "Budget for this month has already been added. Cannot add again.",
      });
    }
    const newBudget = await Budget.create({
      iUserId,
      nDailyLimit,
      nWeeklyLimit,
      nMonthlyLimit,
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
    const budget = await Budget.findOne({ iUserId });
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
module.exports = {
  createOrUpdateBudget,
  getUserBudget,
};
