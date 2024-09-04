import express from "express";
const router = express.Router();

import Journal from "../models/journalModel.js";
import User from "../models/userModel.js";

// Middleware function placeholder to check user authorization on journals
// (Consider adding actual authorization logic if needed)

// Get journal Doc belonging to a specific user
router.get("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    //check if user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // get journal doc
    const foundJournal = await Journal.findOne({ userID });
    // check if journal exists
    if (!foundJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.status(200).json(foundJournal);
  } catch (error) {
    //check for valid objectID
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message:
          "Invalid ObjectId format. Please ensure you’ve entered a valid ObjectId.",
        reason: error.reason?.message || "Unknown reason",
      });
    }
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Get all non-private journals (journals with isPrivate set to false)
router.get("/", async (req, res) => {
  try {
    const allJournals = await Journal.find();

    if (allJournals.length === 0) {
      return res.status(404).json({ message: "No journals found" });
    }
    // Filter entries to include only those with isPrivate: false
    const publicJournals = allJournals
      .map((journal) => {
        // Filter entries to include only non-private ones
        const publicEntries = journal.entries.filter(
          (entry) => !entry.isPrivate
        );
        // Return the journal with filtered entries
        return { ...journal.toObject(), entries: publicEntries };
      })
      .filter((journal) => journal.entries.length > 0); // Exclude journals with no public entries

    if (publicJournals.length === 0) {
      return res.status(404).json({ message: "No public journals found" });
    }
    res.status(200).json(publicJournals);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Create a new Journal entry
router.post("/write", async (req, res) => {
  try {
    const { userID, title, content, isPrivate, date } = req.body;

    // Check if the user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //check if journal doc exist
    const foundJournal = await Journal.findOne({ userID });
    if (!foundJournal) {
      // Create Journal Doc and add their 1st entry
      const newJournal = new Journal({
        userID: foundUser._id,
        entries: [
          {
            title,
            date,
            content,
            isPrivate,
          },
        ],
      });
      await newJournal.save();

      res.status(201).json({
        message: "Journal registered successfully",
        Journal: newJournal,
      });
    } else {
      //journal doc exists add a new entry
      foundJournal.entries.push({
        title,
        date,
        content,
        isPrivate,
      });
      foundJournal.save();
      res.status(201).json({
        message: "Journal registered successfully",
        Journal: foundJournal,
      });
    }
  } catch (error) {
    console.error("Error creating journal: ", error);
    res.status(500).json({ error: error.message });
  }
});

// maybe do batch hides/privates

// Update an existing Journal entry by id
router.put("/:userID/:entryID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const entryID = req.params.entryID;
    const { title, content, isPrivate } = req.body;

    //check if user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the journal document for the user
    const foundJournal = await Journal.findOne({ userID });
    // check if journal exists
    if (!foundJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    //check if entry exists within journal
    const foundEntry = foundJournal.entries.id(entryID);
    if (!foundEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    //update specific entry
    foundEntry.title = title;
    foundEntry.content = content;
    foundEntry.isPrivate = isPrivate;

    //save the updated journal entry
    const updatedJournal = await foundJournal.save();
    res.status(200).json(updatedJournal);
  } catch (error) {
    //check for valid objectID
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message:
          "Invalid ObjectId format. Please ensure you’ve entered a valid ObjectId.",
        reason: error.reason?.message || "Unknown reason",
      });
    }
    console.error("Error updating journal: ", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a Journal DOC by ID
router.delete("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    // Delete the Journal entry
    const foundJournal = await Journal.findOneAndDelete({ userID });

    if (!foundJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.status(200).json({
      message: "Journal deleted successfully",
      deleted_Journal: foundJournal,
    });
  } catch (error) {
    console.error("Error deleting journal: ", error);
    res.status(500).json({ error: error.message });
  }
});

//does order matter?

// delete a multiple entries from user's journal
router.delete("/batch/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const { entryIDs } = req.body; // and array of entry ids to delete

    const missing_Entries = [];
    //check if user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the journal document for the user
    const foundJournal = await Journal.findOne({ userID });
    // check if journal exists
    if (!foundJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    if (entryIDs.length === 0) {
      return res
        .status(400)
        .json({ message: " Please enter a list of EntryIDs" });
    }
    //check if entry exists within journal
    entryIDs.forEach((entry) => {
      const foundEntry = foundJournal.entries.id(entry.entryID);
      if (!foundEntry) {
        missing_Entries.push({ entryID: entry.entryID });
      } else {
        //remove entry
        foundJournal.entries.pull(entry.entryID);
      }
    });
    //save journal
    foundJournal.save();
    res.status(200).json({
      message: "Journal deleted successfully",
      missing_Entries: missing_Entries,
      remaining_Journal: foundJournal,
    });
  } catch (error) {
    console.error("Error deleting journal: ", error);
    res.status(500).json({ error: error.message });
  }
});

// delete a single entry from user journal
router.delete("/:userID/:entryID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const entryID = req.params.entryID;

    //check if user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the journal document for the user
    const foundJournal = await Journal.findOne({ userID });
    // check if journal exists
    if (!foundJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    //check if entry exists within journal
    const foundEntry = foundJournal.entries.id(entryID);
    if (!foundEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    foundJournal.entries.pull(entryID);
    foundJournal.save();
    res.status(200).json({
      message: "Journal deleted successfully",
      deleted_Journal: foundJournal,
    });
  } catch (error) {
    console.error("Error deleting journal: ", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as journalRouter };
