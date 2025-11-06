const ClothingItem = require("../models/clothingItem");
const {
  STATUS_CODES,
  ERROR_MESSAGES,
  mapErrorToResponse,
} = require("../utils/constants");

// GET /items - returns all clothing items
async function getClothingItems(req, res) {
  try {
    const items = await ClothingItem.find({});
    return res.status(STATUS_CODES.OK).json(items);
  } catch (err) {
    const { statusCode, message } = mapErrorToResponse(err);
    return res.status(statusCode).json({ message });
  }
}

// POST /items - creates a new item
function createClothingItem(req, res) {
  console.log('=== CREATE CLOTHING ITEM DEBUG ===');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  console.log('Extracted values:');
  console.log('  name:', name);
  console.log('  weather:', weather);
  console.log('  imageUrl:', imageUrl);
  console.log('  owner:', owner);

  // Use uploaded file if present, otherwise use imageUrl from body
  let finalImageUrl = imageUrl;
  if (req.file) {
    // File was uploaded - use the file path
    // This will be accessible at http://localhost:3001/uploads/filename
    finalImageUrl = `/uploads/${req.file.filename}`;
    console.log('Using uploaded file:', finalImageUrl);
  } else if (imageUrl) {
    console.log('Using imageUrl from body:', imageUrl);
  } else {
    console.log('ERROR: No image source provided!');
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: 'Either imageUrl or file upload is required'
    });
  }

  ClothingItem.create({ name, weather, imageUrl: finalImageUrl, owner })
    .then((item) => {
      console.log('Item created successfully:', item);
      res.status(STATUS_CODES.CREATED).json(item);
    })
    .catch((err) => {
      console.error('Error creating item:', err);
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

// DELETE /items/:itemId - deletes an item by _id
function deleteClothingItem(req, res) {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    })
    .then(() => {
      res
        .status(STATUS_CODES.OK)
        .json({ message: ERROR_MESSAGES.ITEM_DELETED });
    })
    .catch((err) => {
      // Check if it's a custom error with a status code
      if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      // Otherwise use the error mapping function
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

// PUT /items/:itemId/likes - like an item
function likeItem(req, res) {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(STATUS_CODES.OK).json(item))
    .catch((err) => {
      // Check if it's a custom error with a status code
      if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      // Otherwise use the error mapping function
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

// DELETE /items/:itemId/likes - unlike an item
function dislikeItem(req, res) {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(STATUS_CODES.OK).json(item))
    .catch((err) => {
      // Check if it's a custom error with a status code
      if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      // Otherwise use the error mapping function
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
