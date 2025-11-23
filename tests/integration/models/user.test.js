const User = require("../../../models/user");

describe("Model: User", () => {
  describe("Schema validation", () => {
    it("should create a valid user", async () => {
      const userData = {
        name: "Test User",
        avatar: "https://example.com/avatar.png",
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.avatar).toBe(userData.avatar);
    });

    it("should fail without name", async () => {
      const userData = {
        avatar: "https://example.com/avatar.png",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should fail without avatar", async () => {
      const userData = {
        name: "Test User",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should fail with name shorter than 2 characters", async () => {
      const userData = {
        name: "A",
        avatar: "https://example.com/avatar.png",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should fail with name longer than 30 characters", async () => {
      const userData = {
        name: "A".repeat(31),
        avatar: "https://example.com/avatar.png",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should fail with invalid avatar URL", async () => {
      const userData = {
        name: "Test User",
        avatar: "not-a-valid-url",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should accept name with exactly 2 characters", async () => {
      const userData = {
        name: "AB",
        avatar: "https://example.com/avatar.png",
      };

      const user = await User.create(userData);
      expect(user.name).toBe("AB");
    });

    it("should accept name with exactly 30 characters", async () => {
      const userData = {
        name: "A".repeat(30),
        avatar: "https://example.com/avatar.png",
      };

      const user = await User.create(userData);
      expect(user.name).toBe("A".repeat(30));
    });

    it("should accept various valid URL formats", async () => {
      const validUrls = [
        "https://example.com/image.png",
        "http://example.com/image.jpg",
        "https://sub.domain.com/path/to/image.gif",
      ];

      for (const url of validUrls) {
        const user = await User.create({
          name: "Test User",
          avatar: url,
        });
        expect(user.avatar).toBe(url);
        await User.deleteOne({ _id: user._id });
      }
    });
  });

  describe("CRUD operations", () => {
    it("should find user by ID", async () => {
      const user = await User.create({
        name: "Find Me",
        avatar: "https://example.com/avatar.png",
      });

      const foundUser = await User.findById(user._id);

      expect(foundUser).toBeDefined();
      expect(foundUser.name).toBe("Find Me");
    });

    it("should update user", async () => {
      const user = await User.create({
        name: "Original Name",
        avatar: "https://example.com/avatar.png",
      });

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { name: "Updated Name" },
        { new: true }
      );

      expect(updatedUser.name).toBe("Updated Name");
    });

    it("should delete user", async () => {
      const user = await User.create({
        name: "Delete Me",
        avatar: "https://example.com/avatar.png",
      });

      await User.findByIdAndDelete(user._id);
      const deletedUser = await User.findById(user._id);

      expect(deletedUser).toBeNull();
    });

    it("should find all users", async () => {
      await User.create({
        name: "User One",
        avatar: "https://example.com/avatar1.png",
      });
      await User.create({
        name: "User Two",
        avatar: "https://example.com/avatar2.png",
      });

      const users = await User.find({});

      expect(users).toHaveLength(2);
    });
  });
});
