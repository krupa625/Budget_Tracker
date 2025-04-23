const mongoose = require("mongoose");
const budgetSchema = new mongoose.Schema(
  {
    iUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nDailyLimit: {
      type: Number,
      required: true,
    },
    nWeeklyLimit: {
      type: Number,
      required: true,
    },
    nMonthlyLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Budget", budgetSchema);
