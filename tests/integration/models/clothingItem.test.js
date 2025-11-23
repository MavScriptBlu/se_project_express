const mongoose = require("mongoose");
const ClothingItem = require("../../../models/clothingItem");
const User = require("../../../models/user");

describe("Model: ClothingItem", () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user for the owner field
    testUser = await User.create({
      name: "Test Owner",
      avatar: "https://example.com/avatar.png",
    });
  });

  describe("Schema validation", () => {
    it("should create a valid clothing item", async () => {
      const itemData = {
        name: "Test Jacket",
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      };

      const item = await ClothingItem.create(itemData);

      expect(item._id).toBeDefined();
      expect(item.name).toBe(itemData.name);
      expect(item.weather).toBe(itemData.weather);
      expect(item.imageUrl).toBe(itemData.imageUrl);
      expect(item.owner.toString()).toBe(testUser._id.toString());
      expect(item.likes).toEqual([]);
      expect(item.createdAt).toBeDefined();
    });

    it("should fail without name", async () => {
      const itemData = {
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should fail without weather", async () => {
      const itemData = {
        name: "Test Jacket",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should fail without imageUrl", async () => {
      const itemData = {
        name: "Test Jacket",
        weather: "cold",
        owner: testUser._id,
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should fail without owner", async () => {
      const itemData = {
        name: "Test Jacket",
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should fail with invalid weather value", async () => {
      const itemData = {
        name: "Test Jacket",
        weather: "invalid",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should accept all valid weather values", async () => {
      const validWeathers = ["hot", "warm", "cold"];

      for (const weather of validWeathers) {
        const item = await ClothingItem.create({
          name: `${weather} item`,
          weather,
          imageUrl: "https://example.com/item.png",
          owner: testUser._id,
        });
        expect(item.weather).toBe(weather);
      }
    });

    it("should fail with name shorter than 2 characters", async () => {
      const itemData = {
        name: "A",
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should fail with name longer than 30 characters", async () => {
      const itemData = {
        name: "A".repeat(31),
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should fail with invalid imageUrl", async () => {
      const itemData = {
        name: "Test Jacket",
        weather: "cold",
        imageUrl: "not-a-valid-url",
        owner: testUser._id,
      };

      await expect(ClothingItem.create(itemData)).rejects.toThrow();
    });

    it("should default likes to empty array", async () => {
      const item = await ClothingItem.create({
        name: "Test Jacket",
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      });

      expect(item.likes).toEqual([]);
    });

    it("should set createdAt to current date by default", async () => {
      const before = new Date();
      const item = await ClothingItem.create({
        name: "Test Jacket",
        weather: "cold",
        imageUrl: "https://example.com/jacket.png",
        owner: testUser._id,
      });
      const after = new Date();

      expect(item.createdAt).toBeDefined();
      expect(item.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(item.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("CRUD operations", () => {
    it("should find item by ID", async () => {
      const item = await ClothingItem.create({
        name: "Find Me",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUser._id,
      });

      const foundItem = await ClothingItem.findById(item._id);

      expect(foundItem).toBeDefined();
      expect(foundItem.name).toBe("Find Me");
    });

    it("should update item", async () => {
      const item = await ClothingItem.create({
        name: "Original Name",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUser._id,
      });

      const updatedItem = await ClothingItem.findByIdAndUpdate(
        item._id,
        { name: "Updated Name" },
        { new: true }
      );

      expect(updatedItem.name).toBe("Updated Name");
    });

    it("should delete item", async () => {
      const item = await ClothingItem.create({
        name: "Delete Me",
        weather: "cold",
        imageUrl: "https://example.com/item.png",
        owner: testUser._id,
      });

      await ClothingItem.findByIdAndDelete(item._id);
      const deletedItem = await ClothingItem.findById(item._id);

      expect(deletedItem).toBeNull();
    });

    it("should find all items", async () => {
      await ClothingItem.create({
        name: "Item One",
        weather: "hot",
        imageUrl: "https://example.com/item1.png",
        owner: testUser._id,
      });
      await ClothingItem.create({
        name: "Item Two",
        weather: "cold",
        imageUrl: "https://example.com/item2.png",
        owner: testUser._id,
      });

      const items = await ClothingItem.find({});

      expect(items).toHaveLength(2);
    });
  });

  describe("Likes functionality", () => {
    it("should add a like using $addToSet", async () => {
      const item = await ClothingItem.create({
        name: "Likeable Item",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUser._id,
      });

      const likerUser = await User.create({
        name: "Liker",
        avatar: "https://example.com/liker.png",
      });

      const updatedItem = await ClothingItem.findByIdAndUpdate(
        item._id,
        { $addToSet: { likes: likerUser._id } },
        { new: true }
      );

      expect(updatedItem.likes).toHaveLength(1);
      expect(updatedItem.likes[0].toString()).toBe(likerUser._id.toString());
    });

    it("should not add duplicate likes with $addToSet", async () => {
      const item = await ClothingItem.create({
        name: "Likeable Item",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUser._id,
      });

      const likerUser = await User.create({
        name: "Liker",
        avatar: "https://example.com/liker.png",
      });

      // Like twice
      await ClothingItem.findByIdAndUpdate(
        item._id,
        { $addToSet: { likes: likerUser._id } },
        { new: true }
      );
      const updatedItem = await ClothingItem.findByIdAndUpdate(
        item._id,
        { $addToSet: { likes: likerUser._id } },
        { new: true }
      );

      // Should still only have one like
      expect(updatedItem.likes).toHaveLength(1);
    });

    it("should remove a like using $pull", async () => {
      const likerUser = await User.create({
        name: "Liker",
        avatar: "https://example.com/liker.png",
      });

      const item = await ClothingItem.create({
        name: "Likeable Item",
        weather: "warm",
        imageUrl: "https://example.com/item.png",
        owner: testUser._id,
        likes: [likerUser._id],
      });

      const updatedItem = await ClothingItem.findByIdAndUpdate(
        item._id,
        { $pull: { likes: likerUser._id } },
        { new: true }
      );

      expect(updatedItem.likes).toHaveLength(0);
    });

    it("should handle multiple likes from different users", async () => {
      const item = await ClothingItem.create({
        name: "Popular Item",
        weather: "hot",
        imageUrl: "https://example.com/item.png",
        owner: testUser._id,
      });

      const likers = [];
      for (let i = 0; i < 3; i++) {
        const liker = await User.create({
          name: `Liker ${i}`,
          avatar: `https://example.com/liker${i}.png`,
        });
        likers.push(liker);
        await ClothingItem.findByIdAndUpdate(
          item._id,
          { $addToSet: { likes: liker._id } },
          { new: true }
        );
      }

      const updatedItem = await ClothingItem.findById(item._id);
      expect(updatedItem.likes).toHaveLength(3);
    });
  });
});
