const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose.connect(
    "mongodb+srv://deekshitg101:8PoatVG7uN4q3UXi@cluster0.pvfcg.mongodb.net/devTinder"
  );
};

module.exports = connectdb;
