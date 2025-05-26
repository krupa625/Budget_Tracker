const mongoose = require("mongoose");
const { mongo_url } = require("./config");

const connectDb = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("mongodb connected!");
    mongoose.set("debug", true);
  } catch (err) {
    console.log("Error connecting db", err);
  }
};

module.exports = { connectDb };
