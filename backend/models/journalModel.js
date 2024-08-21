import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //should there be a publicJournal / privateJournal model or will this variable surfice
  isPrivate: {
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
export default Journal;

//mongoose is not really relational
//set up all data to be in one document
//indexes
//eg

/*Journal Doc per user

index for user id
userID
entries:[
{
  title
  journalID
  content
  date

},
{
  title
  journalID
  content
  date

},
{
  title
  journalID
  content
  date

},...

]

*/
