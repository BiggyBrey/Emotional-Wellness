import express from "express";
const router = express.Router();
import axios from "axios"

import AiChat from "../models/aiConvoModel.js"
import User from "../models/userModel.js";

// Middleware function placeholder to check user authorization on AiChats
// (Consider adding actual authorization logic if needed)

// Get AiChat Doc belonging to a specific user
router.get("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    //check if user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // get AiChat doc
    const foundAiChat = await AiChat.findOne({ userID });
    // check if AiChat exists
    if (!foundAiChat) {
      return res.status(404).json({ message: "AiChat not found" });
    }

    res.status(200).json(foundAiChat);
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


// Create a new AiChat entry
router.post("/chat", async (req, res) => {
  try {
    const { userID, message } = req.body;

    // Check if the user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini', // or 'gpt-3.5-turbo'
          messages: [
            { role: 'system', content: 'You are a helpful therapist.' },
            { role: 'user' , content : message} // Use the user's input from the request body
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GPTAPI_KEY}`,
            'Content-Type': 'application/json',
            'OpenAi-Organization' : process.env.ORG_KEY,
            'OpenAi-Project' : process.env.PROJ_KEY
          }
        }
      );
  
      // Send the API response back to the client
      //res.status(200).json(response.data.choices[0].message);
      const aiResponse = response.data.choices[0].message.content
      //save in database


    //check if AiChat doc exist
    const foundAiChat = await AiChat.findOne({ userID });
    if (!foundAiChat) {
      // Create a new AiChat document if it doesn't exist
      const newAiChat = new AiChat({
        userID: foundUser._id,
        conversations: [
          {
            messages: [
              { role: 'user', content: message }, // User's message
              { role: 'assistant', content: aiResponse } // AI's response
            ]
          }
        ]
      });
      //save the new chat doc
      await newAiChat.save();
      res.status(201).json({
        message: "AiChat registered successfully",
        AiChat: newAiChat,
      });
    } else {
      // If AiChat document exists, add a new conversation
      foundAiChat.conversations.push({
        messages: [
          { role: 'user', content: message }, // User's message
          { role: 'assistant', content: aiResponse } // AI's response
        ]
      });
      foundAiChat.save();
      res.status(201).json({
        message: "AiChat registered successfully",
        AiChat: foundAiChat,
      });
    }
  } catch (error) {
    console.error("Error creating AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});

// maybe do batch hides/privates

// Update an existing AiChat entry by id
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
    // Find the AiChat document for the user
    const foundAiChat = await AiChat.findOne({ userID });
    // check if AiChat exists
    if (!foundAiChat) {
      return res.status(404).json({ message: "AiChat not found" });
    }

    //check if entry exists within AiChat
    const foundEntry = foundAiChat.entries.id(entryID);
    if (!foundEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    //update specific entry
    foundEntry.title = title;
    foundEntry.content = content;
    foundEntry.isPrivate = isPrivate;

    //save the updated AiChat entry
    const updatedAiChat = await foundAiChat.save();
    res.status(200).json(updatedAiChat);
  } catch (error) {
    //check for valid objectID
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message:
          "Invalid ObjectId format. Please ensure you’ve entered a valid ObjectId.",
        reason: error.reason?.message || "Unknown reason",
      });
    }
    console.error("Error updating AiChat: ", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a AiChat DOC by ID
router.delete("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    // Delete the AiChat entry
    const foundAiChat = await AiChat.findOneAndDelete({ userID });

    if (!foundAiChat) {
      return res.status(404).json({ message: "AiChat not found" });
    }

    res.status(200).json({
      message: "AiChat deleted successfully",
      deleted_AiChat: foundAiChat,
    });
  } catch (error) {
    console.error("Error deleting AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});

//does order matter?

// delete a multiple entries from user's AiChat
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
    // Find the AiChat document for the user
    const foundAiChat = await AiChat.findOne({ userID });
    // check if AiChat exists
    if (!foundAiChat) {
      return res.status(404).json({ message: "AiChat not found" });
    }

    if (entryIDs.length === 0) {
      return res
        .status(400)
        .json({ message: " Please enter a list of EntryIDs" });
    }
    //check if entry exists within AiChat
    entryIDs.forEach((entry) => {
      const foundEntry = foundAiChat.entries.id(entry.entryID);
      if (!foundEntry) {
        missing_Entries.push({ entryID: entry.entryID });
      } else {
        //remove entry
        foundAiChat.entries.pull(entry.entryID);
      }
    });
    //save AiChat
    foundAiChat.save();
    res.status(200).json({
      message: "AiChat deleted successfully",
      missing_Entries: missing_Entries,
      remaining_AiChat: foundAiChat,
    });
  } catch (error) {
    console.error("Error deleting AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});

// delete a single entry from user AiChat
router.delete("/:userID/:entryID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const entryID = req.params.entryID;

    //check if user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the AiChat document for the user
    const foundAiChat = await AiChat.findOne({ userID });
    // check if AiChat exists
    if (!foundAiChat) {
      return res.status(404).json({ message: "AiChat not found" });
    }

    //check if entry exists within AiChat
    const foundEntry = foundAiChat.entries.id(entryID);
    if (!foundEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    foundAiChat.entries.pull(entryID);
    foundAiChat.save();
    res.status(200).json({
      message: "AiChat deleted successfully",
      deleted_AiChat: foundAiChat,
    });
  } catch (error) {
    console.error("Error deleting AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as AiChatRouter };
