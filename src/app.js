const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send("{fullName: Deekshit}");
});

app.post("/user", (req, res) => {
  res.send("User data stored in database");
});

app.put("/user", (req, res) => {
  res.send("User Updated succesfully");
});

app.delete("/user", (req, res) => {
  res.send("user deleted successfully");
});

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
