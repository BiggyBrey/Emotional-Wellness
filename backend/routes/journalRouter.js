const express = require("express");
const router = express.Router();

//should i try to only use 1 model
const Journal = require("../models/journalModel");
const User = require("../models/userModel");
//get a Journal
router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let foundJournal = await Journal.findById(id);
    if (!foundJournal) {
      res.status(404).send("Journal not found");
    } else {
      res.status(200).send(foundJournal);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//get all non private Journals
router.get("/", async (req, res) => {
  try {
    let allJournals = await Journal.find({ private: false });
    if (allJournals.length === 0) {
      res.status(404).send("No Journals found");
    } else {
      res.status(200).send(allJournals);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//66be2db8873f84f3cef96704
//create a Journal
router.post("/write", async (req, res) => {
  try {
    // Get Journal info
    const { userID, content, private } = req.body;
    const currentDate = new Date();

    // check if user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).send("User not Found");
    }

    // Create new Journal
    const newJournal = new Journal({
      user: userID,
      date: currentDate,
      content,
      private,
    });
    await newJournal.save();
    res.status(201).json({
      message: "Journal registered successfully",
      Journal: newJournal,
    });

    // update user reviews collection
    foundUser.journals.push(newJournal);
    await foundUser.save();

    // res.status(201).send(newJournal);
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ error: error.message });
    // res.status(400).send(error);
  }
});

//update Journal
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { content, private } = req.body;

    // update Journal with hashed password
    const updatedJournal = await Journal.findByIdAndUpdate(
      id,
      { content, private },
      { new: true }
    );
    if (!updatedJournal) {
      res.status(404).send("Journal not Found");
    } else {
      res.status(200).send(updatedJournal);
    }
  } catch (error) {
    console.log("error" + error);
    res.status(400).send(error); //
  }
});

//delete Journal
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userID } = req.body;
    let foundJournal = await Journal.findByIdAndDelete(id);
    if (!foundJournal) {
      res.status(404).send("Journal not found");
    } else {
      res.status(200).send("Journal deleted successfully");
    }
    // should this delete from jounral and user, or should i have a user router delete journal
    //delele journal from user.journals
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      res.status(404).send("User not Found");
    } else {
      foundUser.journals = foundUser.journals.filter((e) => e !== id);
      foundUser.save();
      res.json({ journals: foundUser.journals });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
