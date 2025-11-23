const request = require("supertest");
const mongoose = require("mongoose");
const { createTestApp } = require("../../setup/testApp");
const User = require("../../../models/user");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../../utils/constants");

describe("Routes: /users", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe("GET /users", () => {
    it("should return empty array when no users exist", async () => {
      const response = await request(app).get("/users");

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body).toEqual([]);
    });

    it("should return all users", async () => {
      await User.create({
        name: "User One",
        avatar: "https://example.com/avatar1.png",
      });
      await User.create({
        name: "User Two",
        avatar: "https://example.com/avatar2.png",
      });

      const response = await request(app).get("/users");

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBeDefined();
      expect(response.body[1].name).toBeDefined();
    });

    it("should return users with correct structure", async () => {
      await User.create({
        name: "Test User",
        avatar: "https://example.com/avatar.png",
      });

      const response = await request(app).get("/users");

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("avatar");
    });
  });

  describe("GET /users/:userId", () => {
    it("should return a user by ID", async () => {
      const user = await User.create({
        name: "Find Me",
        avatar: "https://example.com/avatar.png",
      });

      const response = await request(app).get(`/users/${user._id}`);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.name).toBe("Find Me");
      expect(response.body.avatar).toBe("https://example.com/avatar.png");
    });

    it("should return 404 for non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/users/${fakeId}`);

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.body.message).toBe(ERROR_MESSAGES.USER_NOT_FOUND);
    });

    it("should return 400 for invalid user ID format", async () => {
      const response = await request(app).get("/users/invalid-id");

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_ID);
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "New User",
        avatar: "https://example.com/avatar.png",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.CREATED);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.avatar).toBe(userData.avatar);
      expect(response.body._id).toBeDefined();
    });

    it("should return 400 when name is missing", async () => {
      const userData = {
        avatar: "https://example.com/avatar.png",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 when avatar is missing", async () => {
      const userData = {
        name: "New User",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 when name is too short", async () => {
      const userData = {
        name: "A",
        avatar: "https://example.com/avatar.png",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 when name is too long", async () => {
      const userData = {
        name: "A".repeat(31),
        avatar: "https://example.com/avatar.png",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 for invalid avatar URL", async () => {
      const userData = {
        name: "New User",
        avatar: "not-a-valid-url",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should accept name with exactly 2 characters", async () => {
      const userData = {
        name: "AB",
        avatar: "https://example.com/avatar.png",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.CREATED);
      expect(response.body.name).toBe("AB");
    });

    it("should accept name with exactly 30 characters", async () => {
      const userData = {
        name: "A".repeat(30),
        avatar: "https://example.com/avatar.png",
      };

      const response = await request(app).post("/users").send(userData);

      expect(response.status).toBe(STATUS_CODES.CREATED);
      expect(response.body.name).toBe("A".repeat(30));
    });
  });

  describe("404 handler", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/nonexistent");

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.body.message).toBe(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    });

    it("should return 404 for unsupported methods", async () => {
      const response = await request(app).delete("/users");

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    });
  });
});
