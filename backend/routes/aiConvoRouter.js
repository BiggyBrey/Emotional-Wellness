import express from "express";
const router = express.Router();
import axios from "axios";

import AiChat from "../models/aiConvoModel.js";
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

// creates a new chat if isNewConversation is true otherwise continue from last
// creates a new chat if there is no previous chat history
router.post("/chat", async (req, res) => {
  try {
    const { userID, message, isNewConversation } = req.body; // include the newConversation flag

    // Check if the user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if AiChat document exists for this user
    let foundAiChat = await AiChat.findOne({ userID });

    // Initialize the conversation messages array
    //system should already be first line
    let messages = [
      { role: "system", content: "You are a helpful therapist." },
    ];

    // If not starting a new conversation, load the last conversation
    if (foundAiChat && !isNewConversation) {
      // get all messages from the last conversation for context
      const lastConversation =
        foundAiChat.conversations[foundAiChat.conversations.length - 1];
      messages = lastConversation.messages;
    }

    // Add the current user message to the conversation
    messages.push({ role: "user", content: message });

    // Make the API call to OpenAI with the current conversation context
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or 'gpt-3.5-turbo'
        messages: messages, // Send the entire message history
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GPTAPI_KEY}`,
          "Content-Type": "application/json",
          "OpenAi-Organization": process.env.ORG_KEY,
          "OpenAi-Project": process.env.PROJ_KEY,
        },
      }
    );

    // Get the AI response from OpenAI
    const aiResponse = response.data.choices[0].message.content;

    // Add the AI response to the conversation
    messages.push({ role: "assistant", content: aiResponse });
    // now messages is up to date with system + optional history + user message + ai response
    // console.log("messages : =" + messages);
    if (!foundAiChat) {
      // Create a new AiChat document if it doesn't exist regardless of newconvo flag
      foundAiChat = new AiChat({
        userID: foundUser._id,
        conversations: [
          {
            summary: message, // make summary/prompt first message
            messages: messages,
          },
        ],
      });
    } else if (isNewConversation) {
      // If starting a new conversation, add a new conversation convo
      foundAiChat.summary = message; // make summary/prompt first message
      foundAiChat.conversations.push({
        messages: messages,
      });
    } else {
      // if not starting a new conversation
      // Add the new user and AI messages to the existing (last) conversation
      foundAiChat.conversations[foundAiChat.conversations.length - 1].messages =
        messages;
    }
    // Save the updated AiChat document
    await foundAiChat.save();

    // Respond to the client with the updated conversation
    res.status(200).json({
      message: "Conversation updated successfully",
      AiChat: foundAiChat,
    });
    // console.log(response.data);
  } catch (error) {
    console.error("Error creating AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});

// continues a conversation with convoID, ideally not the last one.
router.post("/chat/:convoID", async (req, res) => {
  try {
    const convoID = req.params.convoID;
    const { userID, message } = req.body;

    // Check if the user exists
    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if AiChat document exists for this user
    let foundAiChat = await AiChat.findOne({ userID });
    if (!foundAiChat) {
      return res.status(404).json({ message: "AiChat not found" });
    }

    //check if convo exists within AiChat
    const foundConvo = foundAiChat.conversations.id(convoID);
    if (!foundConvo) {
      return res.status(404).json({ message: "convo not found" });
    }
    // get all messages from the selected conversation for context
    const messages = foundConvo.messages;

    // Add the current user message to the conversation
    messages.push({ role: "user", content: message });

    // Make the API call to OpenAI with the current conversation context
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or 'gpt-3.5-turbo'
        messages: messages, // Send the entire message history
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GPTAPI_KEY}`,
          "Content-Type": "application/json",
          "OpenAi-Organization": process.env.ORG_KEY,
          "OpenAi-Project": process.env.PROJ_KEY,
        },
      }
    );

    // Get the AI response from OpenAI
    const aiResponse = response.data.choices[0].message.content;

    // Add the AI response to the conversation
    messages.push({ role: "assistant", content: aiResponse });
    // now messages is up to date with system + optional history + user message + ai response
    // set messages to selected convo messages
    foundConvo.messages = messages;

    // Save the updated AiChat document
    await foundAiChat.save();

    // Respond to the client with the updated conversation
    res.status(200).json({
      message: "Conversation updated successfully",
      AiChat: foundAiChat,
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error creating AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});
// maybe do batch hides/privates

// props wont need since editing messages for an ai is kinda useless
// Update an existing AiChat convo by id

// Delete a AiChat DOC by ID
router.delete("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    // Delete the AiChat convo
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

// delete a multiple conversations from user's AiChat
router.delete("/batch/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const { convoIDs } = req.body; // and array of convo ids to delete

    const missing_conversations = [];
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

    if (convoIDs.length === 0) {
      return res
        .status(400)
        .json({ message: " Please enter a list of convoIDs" });
    }
    //check if convo exists within AiChat
    convoIDs.forEach((convo) => {
      const foundConvo = foundAiChat.conversations.id(convo.convoID);
      if (!foundConvo) {
        missing_conversations.push({ convoID: convo.convoID });
      } else {
        //remove convo
        foundAiChat.conversations.pull(convo.convoID);
      }
    });
    //save AiChat
    foundAiChat.save();
    res.status(200).json({
      message: "AiChat deleted successfully",
      missing_conversations: missing_conversations,
      remaining_AiChat: foundAiChat,
    });
  } catch (error) {
    console.error("Error deleting AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});

// delete a single convo from user AiChat
router.delete("/:userID/:convoID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const convoID = req.params.convoID;

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

    //check if convo exists within AiChat
    const foundConvo = foundAiChat.conversations.id(convoID);
    if (!foundConvo) {
      return res.status(404).json({ message: "convo not found" });
    }

    foundAiChat.conversations.pull(convoID);
    foundAiChat.save();
    res.status(200).json({
      message: "Ai Convo deleted successfully",
      deleted_AiChat: foundAiChat,
    });
  } catch (error) {
    console.error("Error deleting AiChat: ", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as AiChatRouter };
