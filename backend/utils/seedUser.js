//esm vs module ( import vs require)
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Journal from "../models/journalModel.js";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname } from "path";
//to access environment variables
import dotenv from "dotenv";
// import "dotenv/config";

const currentFileUrl = import.meta.url;
const currentDir = dirname(fileURLToPath(currentFileUrl));

// Import the 'path' module explicitly
import * as path from "path";

const parentFolder = path.resolve(currentDir, "../");
dotenv.config({ path: path.join(parentFolder, ".env") });

// Connect to MongoDB
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

const testUsers = [
  {
    username: "firefly42",
    password: await hashPassword("serenity"),
  },
  {
    username: "cryptoNinja",
    password: await hashPassword("blockchain123"),
  },
  {
    username: "musicMaestro",
    password: await hashPassword("melodyMagic"),
  },
  {
    username: "artisticSoul",
    password: await hashPassword("gameOn456"),
  },
  {
    username: "gamerGalaxy",
    password: await hashPassword("paintingColors"),
  },
];

const currentDate = new Date();
const testJournals = [
  //firefly42
  {
    date: currentDate,
    content:
      "Today was great because I finally finished the book I was reading, and I had a fun dinner with friends",
    isPrivate: false,
  },
  {
    date: currentDate,
    content:
      "I struggled with staying focused at work today. I think I need to set clearer goals and take more frequent breaks.",
    isPrivate: false,
  },
  {
    date: currentDate,
    content: "I long for better days",
    isPrivate: true,
  },
  {
    date: currentDate,
    content:
      "I met someone on the bus who was reading the same book as me. We had a great conversation about it",
    isPrivate: false,
  },
  //cryptoNinja
  {
    date: currentDate,
    content:
      "I’m feeling anxious about the upcoming presentation. I hope I can manage my nerves and perform well",
    isPrivate: false,
  },
  {
    date: currentDate,
    content:
      "I practiced my public speaking skills in front of a mirror today. It felt awkward but helpful",
    isPrivate: false,
  },
  {
    date: currentDate,
    content:
      "I had a nightmare about being lost in a maze. I woke up feeling unsettled.",
    isPrivate: false,
  },
  //musicMaestro
  {
    date: currentDate,
    content:
      "Today was great because I finally finished the book I was reading, and I had a fun dinner with friends",
    isPrivate: true,
  },
  {
    date: currentDate,
    content:
      "Plan a surprise party for Sarah’s birthday. Ideas: theme, guest list, location.",
    isPrivate: true,
  },
  //artisticSoul
  {
    date: currentDate,
    content:
      "Visited the Grand Canyon today. The view was breathtaking, and it was a memorable experience",
    isPrivate: false,
  },
  //gamergalaxy has 0
];

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function populateJournals() {
  let journalCount = 4;
  let journalIndex = 0;

  //for each user
  for (let i = 0; i < testUsers.length; i++) {
    // Get user by username
    const user = testUsers[i];
    const foundUser = await User.findOne({ username: user.username });

    if (!foundUser) {
      console.error(`User ${user.username} not found`);
      continue;
    }
    //create new journal
    const newJournal = new Journal({
      userID: foundUser._id,
      entries: [],
    });
    await newJournal.save();
    //add journals to entries
    for (let j = 0; j < journalCount; j++) {
      if (journalIndex >= testJournals.length) {
        console.error("Not enough journals to populate");
        return;
      }

      newJournal.entries.push({
        date: currentDate,
        content: testJournals[journalIndex].content,
        isPrivate: testJournals[journalIndex].isPrivate,
      });

      await newJournal.save();
      journalIndex++;
    }

    // Update journalCount for next user
    journalCount--;
  }
}

// Seed the database with starter data
async function seedData() {
  try {
    await connectDb().catch(console.dir);
    // First, clear the database of existing modules
    await User.deleteMany({});
    await Journal.deleteMany();

    // Insert starter modules
    await User.insertMany(testUsers);

    //add journals - journals r dependent on users
    await populateJournals();
    console.log("Database seeded!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();
