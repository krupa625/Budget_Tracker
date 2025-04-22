const bcrypt = require("bcrypt");

const hashPassword = async function (next) {
  if (!this.isModified("sPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.sPassword = await bcrypt.hash(this.sPassword, salt);
  next();
};

module.exports = { hashPassword };
