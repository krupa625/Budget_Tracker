const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");
const { STATUS_CODES } = require("../utils/statuscode");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "15d" });
};
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(STATUS_CODES.Unauthorized)
          .json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res
        .status(STATUS_CODES.Unauthorized)
        .json({ message: "Token invalid ya expire ho gaya" });
    }
  } else {
    return res
      .status(STATUS_CODES.Unauthorized)
      .json({ message: "Token missing" });
  }
};
module.exports = { generateToken, authenticate };
