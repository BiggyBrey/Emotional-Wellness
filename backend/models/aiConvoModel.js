import mongoose from "mongoose";

const AiChatSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  conversations: [
    {
      // mongo Automatically generate a new ChatID
      // ChatID: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   default: new mongoose.Types.ObjectId(),
      // },
      summary: String,
      title: String,
      isPrivate: Boolean,
      mood: {
        type: String,
        required: true,
      },
      messages: [
        {
          role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now, // Automatically set the timestamp for each message
          },
          favorite: Boolean,
        },
      ],
      startedAt: {
        type: Date,
        default: Date.now, // When the conversation started
      },
      updatedAt: {
        type: Date,
        default: Date.now, // When the conversation was last updated
      },
    },
  ],
});
/*
Plan for ai chatbot
backend
create chatbot Chat model
add crud routes for Chats so aiChat can see old Chats

frontend
ui
implement api calls to frontend ui

*/

const AiChat = mongoose.model("AiChat", AiChatSchema);
export default AiChat;
