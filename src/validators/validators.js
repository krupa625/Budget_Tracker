const { body } = require("express-validator");


const userValidationRules = [
  body("sUserName").notEmpty().withMessage("Username is required"),
  body("sEmail").isEmail().withMessage("Valid email is required"),
  body("sPassword")
 .notEmpty()
    .withMessage("Password must required!"),
];


const inventoryValidationRules = [
  body("sType").notEmpty().withMessage("Inventory type is required"),
  body("sName").notEmpty().withMessage("Inventory name is required"),
  body("nQuantityAvailable")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  body("nPricePerUnit")
    .isFloat({ min: 0 })
    .withMessage("Price per unit must be a non-negative number"),
];


const budgetValidationRules = [

  body("nDailyLimit")
    .isFloat({ min: 0 })
    .withMessage("Daily limit must be a positive number"),
  body("nWeeklyLimit")
    .isFloat({ min: 0 })
    .withMessage("Weekly limit must be a positive number"),
  body("nMonthlyLimit")
    .isFloat({ min: 0 })
    .withMessage("Monthly limit must be a positive number"),
];


const expenseValidationRules = [
  body("items.*.inventoryItemId").notEmpty().withMessage("Inventory item ID is required"),
  body("items.*.nQuantityPurchased")
    .isInt({ min: 1 })
    .withMessage("Purchased quantity must be at least 1"),
];

module.exports = {
  userValidationRules,
  inventoryValidationRules,
  budgetValidationRules,
  expenseValidationRules,
};
