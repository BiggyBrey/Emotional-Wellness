const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //should there be a publicJournal / privateJournal model or will this variable surfice
  private: {
    type: Boolean,
    required: true,
  },
  //https://mongoosejs.com/docs/schematypes.html#dates
  //date journal made
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  aiAnalysis: String,
});

const Journal = mongoose.model("Journal", journalSchema);
module.exports = Journal;
