import express from "express";
const router = express.Router();

import Journal from "../models/journalModel.js";
import User from "../models/userModel.js";

// Middleware function placeholder to check user authorization on journals
// (Consider adding actual authorization logic if needed)

// Get a specific Journal by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundJournal = await Journal.findById(id);

    if (!foundJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.status(200).json(foundJournal);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Get all journals belonging to a specific user
// The user should only be able to see their own journals
router.get("/fromUser/:uid", async (req, res) => {
  try {
    const userID = req.params.uid;
    const foundUser = await User.findById(userID).populate("journals");

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser.journals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all non-private journals (journals with isPrivate set to false)
router.get("/", async (req, res) => {
  try {
    const allJournals = await Journal.find({ isPrivate: false });

    if (allJournals.length === 0) {
      return res.status(404).json({ message: "No journals found" });
    }

    res.status(200).json(allJournals);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Create a new Journal entry
router.post("/write", async (req, res) => {
  try {
    const { userID, content, isPrivate } = req.body;
    const currentDate = new Date();

    // Check if the user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save the new Journal
    const newJournal = new Journal({
      user: userID,
      date: currentDate,
      content,
      isPrivate,
    });
    await newJournal.save();

    // Add the new Journal to the user's list of journals
    foundUser.journals.push(newJournal);
    await foundUser.save();

    res.status(201).json({
      message: "Journal registered successfully",
      Journal: newJournal,
    });
  } catch (error) {
    console.error("Error creating journal: ", error);
    res.status(500).json({ error: error.message });
  }
});

// Update an existing Journal by ID
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { content, isPrivate } = req.body;

    // Update the Journal and return the updated entry
    const updatedJournal = await Journal.findByIdAndUpdate(
      id,
      { content, isPrivate },
      { new: true }
    );

    if (!updatedJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.status(200).json(updatedJournal);
  } catch (error) {
    console.error("Error updating journal: ", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a Journal by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userID } = req.body;

    // Delete the Journal entry
    const foundJournal = await Journal.findByIdAndDelete(id);

    if (!foundJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    // Remove the deleted Journal from the user's list of journals
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    foundUser.journals = foundUser.journals.filter(
      (journalID) => journalID !== id
    );
    await foundUser.save();

    res.status(200).json({
      message: "Journal deleted successfully",
      journals: foundUser.journals,
    });
  } catch (error) {
    console.error("Error deleting journal: ", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as journalRouter };
