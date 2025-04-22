const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/auth");
const { STATUS_CODES } = require("../utils/statuscode");

const registerUser = async (req, res) => {
  try {
    const { sUserName, sEmail, sPassword } = req.body;
    const existingUser = await User.findOne({ sEmail });
    if (existingUser) {
      return res
        .status(STATUS_CODES.BadRequest)
        .json({ message: "User already exists" });
    }
    const user = await User.create({ sUserName, sEmail, sPassword });
    const token = generateToken(user._id);
    res.status(STATUS_CODES.Create).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        sUserName: user.sUserName,
        sEmail: user.sEmail,
      },
      token,
    });
  } catch (err) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Server error", error: err.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { sEmail, sPassword } = req.body;
    const user = await User.findOne({ sEmail });
    if (!user) {
      return res
        .status(STATUS_CODES.BadRequest)
        .json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(sPassword, user.sPassword);
    if (!isMatch) {
      return res
        .status(STATUS_CODES.BadRequest)
        .json({ message: "Invalid credentials" });
    } else {
      res.status(STATUS_CODES.OK).json({
        message: "Login successful",
        user: {
          id: user._id,
          sUserName: user.sUserName,
          sEmail: user.sEmail,
        },
      });
    }
  } catch (err) {
    res
      .status(STATUS_CODES.InternalServerError)
      .json({ message: "Server error", error: err.message });
  }
};
module.exports = { registerUser, loginUser };
