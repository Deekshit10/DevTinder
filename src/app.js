const express = require("express");

const bcrypt = require("bcrypt");

const connectdb = require("./config/database.js");

const { validateSignupdata } = require("./utils/validate.js");

const User = require("./model/user.js");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    validateSignupdata(req);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("new user data storeed in database");
  } catch (error) {
    res.status(400).send("something went wrong" + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isvalidPassword = await bcrypt.compare(password, user.password);
    if (isvalidPassword) {
      res.send("login Successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.find({ firstName: userEmail });
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
    app.listen(3000, () => {});
  })
  .catch((err) => {
    console.log(err);
  });
