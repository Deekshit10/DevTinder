const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose.connect(
    "mongodb+srv://deekshitg101:Deek123@cluster0.pvfcg.mongodb.net/devTinder"
  );
};

module.exports = connectdb;
