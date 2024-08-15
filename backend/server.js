const mongoose = require("mongoose");
const express = require("express");
const app = express();

//elias has a non cors version ie server proxy
// import cors from "cors";

const apiRouter = require("./routes/router");
const PORT = 3000;

app.use(express.json());
// app.use(cors());
app.use("/api/v1", apiRouter);

const uri =
  "mongodb+srv://michaeledquilan:avBMVN4pNUArKfQP@cluster0.ipfvapa.mongodb.net/emotional-wellness?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function connectDb() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log("Error: " + error);
    await mongoose.disconnect();
  }
}

app.listen(PORT, async () => {
  await connectDb().catch(console.dir);
  console.log(`Express API started: http://localhost:${PORT}`);
});
