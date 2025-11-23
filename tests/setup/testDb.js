const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Connect to in-memory database
const connect = async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: "7.0.4",
      downloadDir: "/tmp/mongodb-binaries",
    },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

// Clear all data in collections
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

// Close database connection and stop server
const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase,
};
