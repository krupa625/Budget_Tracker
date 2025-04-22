const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const {userValidationRules} = require('../validators/validators');
const validate = require("../middleware/validateResult");
const router = express.Router();

router.post("/register",userValidationRules,validate, registerUser);
router.post("/login", authenticate, loginUser);
module.exports = router;
