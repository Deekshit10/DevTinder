const express = require("express");

const connectdb = require("./config/database.js");

const User = require("./model/user.js");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("new user data storeed in database");
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userFirstname = req.body.firstName;

  try {
    const user = await User.find({ firstName: userFirstname });
    if (!user) {
      res.send("user not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();

    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);

    res.send("user deleted succesfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  const data = req.body;
  try {
    const allowedUpdates = ["Gender", "age", "about", "skills"];

    const isallowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isallowed) {
      console.log("inside isallowed");
      throw new Error("update not allowed");
    }
    if (data.skills?.length > 10) {
      throw new Error("skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    res.send("user updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});
connectdb()
  .then(() => {
    console.log("Database connected succesfully");
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
