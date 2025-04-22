const mongoose = require("mongoose");
const { hashPassword } = require("../middleware/hashpass");

const userSchema = new mongoose.Schema(
  {
    sUserName: { type: String, required: true, trim: true },
    sEmail: { type: String, unique: true, required: true },
    sPassword: { type: String, required: true },
  },
  { timestamps: true }
);
userSchema.pre("save", hashPassword);
module.exports = mongoose.model("User", userSchema);
