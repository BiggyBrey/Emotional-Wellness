import mongoose from "mongoose";

// THIS IS A RELATIONAL ( SQL) WAY OF ORGANIZING DATA
// not that efficent for nosql models like mongo for search
// better to have all info in huge docs

// const journalSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   //should there be a publicJournal / privateJournal model or will this variable surfice
//   isPrivate: {
//     type: Boolean,
//     required: true,
//   },
//   //https://mongoosejs.com/docs/schematypes.html#dates
//   //date journal made
//   date: {
//     type: Date,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   aiAnalysis: String,
// });

// MONGO WAY
const journalSchema = new mongoose.Schema({
  // has all journal entries from a user
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  entries: [
    {
      journalID: mongoose.ObjectId,
      title: String,
      content: {
        type: String,
        required: true,
      },
      isPrivate: {
        type: Boolean,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      aiAnalysis: String,
    },
  ],
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
