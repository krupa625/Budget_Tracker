function getSuggestions({ amount, item }) {
  return [
    `You are trying to purchase ${item} for ₹${amount}. Try reducing the quantity or find a cheaper item.`,
    `Consider removing other less important expenses to stay within budget.`,
  ];
}
module.exports = { getSuggestions };
