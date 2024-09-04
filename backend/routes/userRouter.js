import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

import User from "../models/userModel.js";

// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message:
          "Invalid ObjectId format. Please ensure you’ve entered a valid ObjectId.",
        reason: error.reason?.message || "Unknown reason",
      });
    }

    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Check if a username is available
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({ username });

    res.status(200).json({ available: !existingUser });
  } catch (error) {
    console.error("Error checking username availability: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(400).json({ error: error.message });
  }
});

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({ error: error.message });
  }
});

// User login
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

    res
      .status(200)
      .json({ message: "Logged in successfully", userId: foundUser._id });
  } catch (error) {
    console.error("Error logging in user: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Update user by ID
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with new details
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundUser = await User.findByIdAndDelete(id);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as userRouter };
