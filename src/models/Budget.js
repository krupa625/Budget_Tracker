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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
budgetSchema.virtual("oUser", {
  foreignField: "_id",
  localField: "iUserId",
  justOne: true,
  ref: "User",
});
module.exports = mongoose.model("Budget", budgetSchema);
