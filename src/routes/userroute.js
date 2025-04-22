const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authenticate, loginUser);
module.exports = router;
