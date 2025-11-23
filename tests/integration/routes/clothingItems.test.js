const request = require("supertest");
const mongoose = require("mongoose");
const { createTestApp } = require("../../setup/testApp");
const ClothingItem = require("../../../models/clothingItem");
const User = require("../../../models/user");
const { STATUS_CODES, ERROR_MESSAGES } = require("../../../utils/constants");

describe("Routes: /items", () => {
  let app;
  let testUserId;

  beforeEach(async () => {
    // Create a test user and use their ID for the app
    const testUser = await User.create({
      name: "Test User",
      avatar: "https://example.com/avatar.png",
    });
    testUserId = testUser._id.toString();
    app = createTestApp(testUserId);
  });

  describe("GET /items", () => {
    it("should return empty array when no items exist", async () => {
      const response = await request(app).get("/items");

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body).toEqual([]);
    });

    it("should return all clothing items", async () => {
      await ClothingItem.create({
        name: "Item One",
        weather: "hot",
        imageUrl: "https://example.com/item1.png",
        owner: testUserId,
      });
      await ClothingItem.create({
        name: "Item Two",
        weather: "cold",
        imageUrl: "https://example.com/item2.png",
        owner: testUserId,
      });

      const response = await request(app).get("/items");

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body).toHaveLength(2);
    });

    it("should return items with correct structure", async () => {
      await ClothingItem.create({
        name: "Test Item",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUserId,
      });

      const response = await request(app).get("/items");

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("weather");
      expect(response.body[0]).toHaveProperty("imageUrl");
      expect(response.body[0]).toHaveProperty("owner");
      expect(response.body[0]).toHaveProperty("likes");
      expect(response.body[0]).toHaveProperty("createdAt");
    });
  });

  describe("POST /items", () => {
    it("should create a new clothing item", async () => {
      const itemData = {
        name: "New Jacket",
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.CREATED);
      expect(response.body.name).toBe(itemData.name);
      expect(response.body.weather).toBe(itemData.weather);
      expect(response.body.imageUrl).toBe(itemData.imageUrl);
      expect(response.body.owner).toBe(testUserId);
      expect(response.body._id).toBeDefined();
    });

    it("should return 400 when name is missing", async () => {
      const itemData = {
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 when weather is missing", async () => {
      const itemData = {
        name: "New Jacket",
        imageUrl: "https://example.com/jacket.png",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 when imageUrl is missing", async () => {
      const itemData = {
        name: "New Jacket",
        weather: "cold",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 for invalid weather value", async () => {
      const itemData = {
        name: "New Jacket",
        weather: "invalid",
        imageUrl: "https://example.com/jacket.png",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 for invalid imageUrl", async () => {
      const itemData = {
        name: "New Jacket",
        weather: "cold",
        imageUrl: "not-a-valid-url",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 when name is too short", async () => {
      const itemData = {
        name: "A",
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 400 when name is too long", async () => {
      const itemData = {
        name: "A".repeat(31),
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
      };

      const response = await request(app).post("/items").send(itemData);

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should accept all valid weather values", async () => {
      const validWeathers = ["hot", "warm", "cold"];

      for (const weather of validWeathers) {
        const response = await request(app).post("/items").send({
          name: `${weather} item`,
          weather,
          imageUrl: "https://example.com/item.png",
        });

        expect(response.status).toBe(STATUS_CODES.CREATED);
        expect(response.body.weather).toBe(weather);
      }
    });
  });

  describe("DELETE /items/:itemId", () => {
    it("should delete an existing item", async () => {
      const item = await ClothingItem.create({
        name: "Delete Me",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUserId,
      });

      const response = await request(app).delete(`/items/${item._id}`);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.message).toBe(ERROR_MESSAGES.ITEM_DELETED);

      // Verify item is deleted
      const deletedItem = await ClothingItem.findById(item._id);
      expect(deletedItem).toBeNull();
    });

    it("should return 404 for non-existent item", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).delete(`/items/${fakeId}`);

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.body.message).toBe(ERROR_MESSAGES.ITEM_NOT_FOUND);
    });

    it("should return 400 for invalid item ID format", async () => {
      const response = await request(app).delete("/items/invalid-id");

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_ID);
    });
  });

  describe("PUT /items/:itemId/likes", () => {
    it("should like an item", async () => {
      const item = await ClothingItem.create({
        name: "Likeable Item",
        weather: "hot",
        imageUrl: "https://example.com/item.png",
        owner: testUserId,
      });

      const response = await request(app).put(`/items/${item._id}/likes`);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.likes).toContain(testUserId);
    });

    it("should not duplicate likes (idempotent)", async () => {
      const item = await ClothingItem.create({
        name: "Likeable Item",
        weather: "hot",
        imageUrl: "https://example.com/item.png",
        owner: testUserId,
      });

      // Like twice
      await request(app).put(`/items/${item._id}/likes`);
      const response = await request(app).put(`/items/${item._id}/likes`);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.likes).toHaveLength(1);
    });

    it("should return 404 for non-existent item", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).put(`/items/${fakeId}/likes`);

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.body.message).toBe(ERROR_MESSAGES.ITEM_NOT_FOUND);
    });

    it("should return 400 for invalid item ID format", async () => {
      const response = await request(app).put("/items/invalid-id/likes");

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_ID);
    });
  });

  describe("DELETE /items/:itemId/likes", () => {
    it("should unlike an item", async () => {
      const item = await ClothingItem.create({
        name: "Liked Item",
        weather: "cold",
        imageUrl: "https://example.com/item.png",
        owner: testUserId,
        likes: [testUserId],
      });

      const response = await request(app).delete(`/items/${item._id}/likes`);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.likes).not.toContain(testUserId);
      expect(response.body.likes).toHaveLength(0);
    });

    it("should handle unliking an item not liked (idempotent)", async () => {
      const item = await ClothingItem.create({
        name: "Not Liked Item",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUserId,
      });

      const response = await request(app).delete(`/items/${item._id}/likes`);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.likes).toHaveLength(0);
    });

    it("should return 404 for non-existent item", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).delete(`/items/${fakeId}/likes`);

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.body.message).toBe(ERROR_MESSAGES.ITEM_NOT_FOUND);
    });

    it("should return 400 for invalid item ID format", async () => {
      const response = await request(app).delete("/items/invalid-id/likes");

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.message).toBe(ERROR_MESSAGES.INVALID_ID);
    });

    it("should preserve other users likes when unliking", async () => {
      const otherUser = await User.create({
        name: "Other User",
        avatar: "https://example.com/other.png",
      });

      const item = await ClothingItem.create({
        name: "Multi-liked Item",
        weather: "hot",
        imageUrl: "https://example.com/item.png",
        owner: testUserId,
        likes: [testUserId, otherUser._id],
      });

      const response = await request(app).delete(`/items/${item._id}/likes`);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.likes).toHaveLength(1);
      expect(response.body.likes[0]).toBe(otherUser._id.toString());
    });
  });
});
