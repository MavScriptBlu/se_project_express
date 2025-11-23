const testDb = require("./testDb");

// Connect to in-memory database before running tests
beforeAll(async () => {
  await testDb.connect();
});

// Clear database between tests
afterEach(async () => {
  await testDb.clearDatabase();
});

// Close database connection after all tests
afterAll(async () => {
  await testDb.closeDatabase();
});
