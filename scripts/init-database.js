/* eslint-disable no-console */
const mongoose = require("mongoose");
const User = require("../models/user");
const ClothingItem = require("../models/clothingItem");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wtwr_db";

// Test user ID that the app expects
const TEST_USER_ID = "6863bbc8eb627a884f678c38";

// Sample user data
const testUser = {
  _id: TEST_USER_ID,
  name: "Elise Bouer",
  avatar: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
};

// Sample clothing items
const sampleClothingItems = [
  {
    name: "Cap",
    weather: "hot",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dc3e5611d25e6bca753a71f62c0a96",
    owner: TEST_USER_ID,
  },
  {
    name: "Hoodie",
    weather: "warm",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Hoodie.png?etag=5f52451d0958ccb1016c78a45603a4e8",
    owner: TEST_USER_ID,
  },
  {
    name: "Jacket",
    weather: "cold",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png?etag=f4bb188deaa25ac84ce2338be2d404ad",
    owner: TEST_USER_ID,
  },
  {
    name: "Sneakers",
    weather: "warm",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sneakers.png?etag=3efeec41c1c78b8afe26859ca7fa7b6f",
    owner: TEST_USER_ID,
  },
  {
    name: "T-Shirt",
    weather: "hot",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png?etag=44ed1963c44ab19cd2f5011522c5fc09",
    owner: TEST_USER_ID,
  },
  {
    name: "Coat",
    weather: "cold",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Coat.png?etag=298717ed89d5e40b1954a1831ae0bdd4",
    owner: TEST_USER_ID,
  },
  {
    name: "Boots",
    weather: "cold",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Boots.png?etag=1e7e55f33fbb9f4366cd23fe88a0d50c",
    owner: TEST_USER_ID,
  },
  {
    name: "Dress",
    weather: "hot",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Dress.png?etag=1f9cd7667a79a7c4d5b5c9d6b41c0c14",
    owner: TEST_USER_ID,
  },
  {
    name: "Scarf",
    weather: "cold",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Scarf.png?etag=74efbee93ed8926a14cc0d5e34ca8f50",
    owner: TEST_USER_ID,
  },
];

async function initializeDatabase() {
  console.log("========================================");
  console.log("WTWR Database Initialization");
  console.log("========================================\n");

  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    console.log(`URI: ${MONGODB_URI}\n`);

    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB successfully!\n");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await ClothingItem.deleteMany({});
    console.log("✓ Database cleared\n");

    // Create test user
    console.log("Creating test user...");
    const user = await User.create(testUser);
    console.log(`✓ Test user created: ${user.name} (ID: ${user._id})\n`);

    // Create clothing items
    console.log("Creating sample clothing items...");
    const items = await ClothingItem.insertMany(sampleClothingItems);
    console.log(`✓ Created ${items.length} clothing items:\n`);

    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.weather} weather)`);
    });

    console.log("\n========================================");
    console.log("Database Initialization Complete!");
    console.log("========================================\n");

    console.log("Database Summary:");
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Clothing Items: ${await ClothingItem.countDocuments()}\n`);

    console.log("You can now:");
    console.log("1. Start the backend: npm run dev");
    console.log("2. Start the frontend: cd ../se_project_react && npm run dev");
    console.log("3. Visit: http://localhost:3000\n");
  } catch (error) {
    console.error("\n✗ Error initializing database:");
    console.error(error.message);
    console.error("\nMake sure MongoDB is running:");
    console.error("  sudo systemctl status mongodb");
    console.error("  OR");
    console.error("  sudo systemctl start mongodb\n");
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the initialization
initializeDatabase();
