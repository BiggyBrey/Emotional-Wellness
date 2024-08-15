const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dailyMoods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mood",
    },
  ],
  //https://mongoosejs.com/docs/schematypes.html#maps
  // settings
  aiPreference: {
    type: Map,
    of: String,
  },
  //journal entries
  journals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journal",
    },
  ],
  //ai talks
  discussions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
