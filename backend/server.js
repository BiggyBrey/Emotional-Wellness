import mongoose from "mongoose";
import express from "express";
const app = express();

import dotenv from "dotenv";

dotenv.config();
//elias has a non cors version ie server proxy
// import cors from "cors";

import router from "./routes/router.js";
const PORT = 3000;

app.use(express.json());
// app.use(cors());
app.use("/api/v1", router);

const uri = process.env.MONGO_URI;
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
