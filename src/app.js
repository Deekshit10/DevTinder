const express = require("express");
const { adminAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/details", (req, res, next) => {
  res.send("all details are fetched from db");
});

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
