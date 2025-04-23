function getSuggestions({
  dailyExceeded,
  weeklyExceeded,
  monthlyExceeded,
  inventoryItem,
  currentExpense,
  budget,
}) {
  const tips = [];

  if (dailyExceeded) {
    tips.push(
      `Try reducing your daily purchases. Your daily limit is ₹${budget.nDailyLimit}, but you're trying to spend ₹${currentExpense}.`
    );
  }
  if (weeklyExceeded) {
    tips.push(
      `You've already spent much this week. Weekly limit: ₹${budget.nWeeklyLimit}.`
    );
  }
  if (monthlyExceeded) {
    tips.push(
      `You may want to hold off until next month. Monthly budget is ₹${budget.nMonthlyLimit}.`
    );
  }

  tips.push(
    `Instead of "${inventoryItem.sName}", consider buying in smaller quantity or switching to a cheaper item.`
  );

  return tips;
}

module.exports = { getSuggestions };
