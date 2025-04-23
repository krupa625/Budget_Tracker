function getSuggestions({ exceedingItems, budget }) {
  const tips = [];
  tips.push("Your current selection exceeds your budget limits. Here’s where it’s going over:");

  exceedingItems.forEach(({ item, nQuantityPurchased, currentExpense, newDailyTotal, newWeeklyTotal, newMonthlyTotal }) => {
    let msg = `- Remove "${item.sName}" (₹${item.nPricePerUnit} per unit, Qty: ${nQuantityPurchased})`;

    const exceedDetails = [];

    if (newDailyTotal > budget.nDailyLimit) {
      exceedDetails.push(`Daily (limit: ₹${budget.nDailyLimit}, after: ₹${newDailyTotal})`);
    }
    if (newWeeklyTotal > budget.nWeeklyLimit) {
      exceedDetails.push(`Weekly (limit: ₹${budget.nWeeklyLimit}, after: ₹${newWeeklyTotal})`);
    }
    if (newMonthlyTotal > budget.nMonthlyLimit) {
      exceedDetails.push(`Monthly (limit: ₹${budget.nMonthlyLimit}, after: ₹${newMonthlyTotal})`);
    }

    if (exceedDetails.length > 0) {
      msg += ` → Exceeds: ${exceedDetails.join(", ")}`;
    }

    tips.push(msg);
  });

  return tips;
}

module.exports = { getSuggestions };
