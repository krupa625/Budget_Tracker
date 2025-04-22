const { connectDb } = require("./src/config/db");
const { port } = require("./src/config/config");
const express = require("express");
const route = require("./src/routes");
const app = express();
connectDb();

app.use(express.json());
app.use("/healthcheck", (req, res) => {
  res.send("Server is Up....");
});
app.use("/api", route);

app.listen(port, () => {
  console.log(`server is Running.....${port}`);
});
