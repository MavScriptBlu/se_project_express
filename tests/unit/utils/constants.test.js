const {
  STATUS_CODES,
  ERROR_MESSAGES,
  mapErrorToResponse,
} = require("../../../utils/constants");

describe("Utils: constants", () => {
  describe("STATUS_CODES", () => {
    it("should have correct HTTP status codes", () => {
      expect(STATUS_CODES.OK).toBe(200);
      expect(STATUS_CODES.CREATED).toBe(201);
      expect(STATUS_CODES.NO_CONTENT).toBe(204);
      expect(STATUS_CODES.BAD_REQUEST).toBe(400);
      expect(STATUS_CODES.UNAUTHORIZED).toBe(401);
      expect(STATUS_CODES.FORBIDDEN).toBe(403);
      expect(STATUS_CODES.NOT_FOUND).toBe(404);
      expect(STATUS_CODES.CONFLICT).toBe(409);
      expect(STATUS_CODES.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe("ERROR_MESSAGES", () => {
    it("should have all required error messages", () => {
      expect(ERROR_MESSAGES.USER_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.ITEM_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.INVALID_ID).toBeDefined();
      expect(ERROR_MESSAGES.INVALID_DATA).toBeDefined();
      expect(ERROR_MESSAGES.DUPLICATE_ENTRY).toBeDefined();
      expect(ERROR_MESSAGES.GENERIC_SERVER_ERROR).toBeDefined();
    });
  });

  describe("mapErrorToResponse", () => {
    it("should return 400 for CastError", () => {
      const error = new Error("Cast Error");
      error.name = "CastError";

      const result = mapErrorToResponse(error);

      expect(result.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
      expect(result.message).toBe(ERROR_MESSAGES.INVALID_ID);
    });

    it("should return 400 for ValidationError", () => {
      const error = new Error("Validation Error");
      error.name = "ValidationError";

      const result = mapErrorToResponse(error);

      expect(result.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
      expect(result.message).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it("should return 409 for duplicate key error (code 11000)", () => {
      const error = new Error("Duplicate Key");
      error.code = 11000;

      const result = mapErrorToResponse(error);

      expect(result.statusCode).toBe(STATUS_CODES.CONFLICT);
      expect(result.message).toBe(ERROR_MESSAGES.DUPLICATE_ENTRY);
    });

    it("should return 500 for unknown errors", () => {
      const error = new Error("Unknown error");

      const result = mapErrorToResponse(error);

      expect(result.statusCode).toBe(STATUS_CODES.INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(ERROR_MESSAGES.GENERIC_SERVER_ERROR);
    });

    it("should prioritize CastError over other properties", () => {
      const error = new Error("Cast Error with code");
      error.name = "CastError";
      error.code = 11000;

      const result = mapErrorToResponse(error);

      expect(result.statusCode).toBe(STATUS_CODES.BAD_REQUEST);
      expect(result.message).toBe(ERROR_MESSAGES.INVALID_ID);
    });
  });
});
