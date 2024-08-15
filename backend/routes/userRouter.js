const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../models/userModel");

//get a user
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let foundUser = await User.findById(id);
    if (!foundUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(foundUser);
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message:
          "there was a problem with the ObjectId format. Please ensure that you've entered a valid ObjectId",
        reason: error.reason.message,
      });
    }
    console.log(error);
    res.status(500).send(error);
  }
});

// Route to check if a username is available
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(200).json({ available: false }); // Username is not available
    } else {
      res.status(200).json({ available: true }); // Username is available
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    let allUsers = await User.find();
    if (allUsers.length === 0) {
      res.status(404).send("No Users found");
    } else {
      res.status(200).send(allUsers);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//create a user
router.post("/register", async (req, res) => {
  try {
    // Get user info
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      //return prevents server from crashing?
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    //res.send vs res.json standard?
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
    // res.status(201).send(newUser);
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ error: error.message });
    // res.status(400).send(error);
  }
});

// Route for User to Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // send the user id
    return res
      .status(200)
      .json({ message: "Logged in successfully", userId: foundUser._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//update user
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // update user with hashed password
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      //create user
      const newUser = new User({ username, hashedPassword });
      await newUser.save();
      res.status(201).send(newUser);
      //or should i just return error cuz id doesnt exist
      //res.status(404).send("User not Found")
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (error) {
    console.log("error" + error);
    res.status(400).send(error); //
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let foundUser = await User.findByIdAndDelete(id);
    if (!foundUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
