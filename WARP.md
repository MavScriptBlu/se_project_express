# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Server Operations
- `npm run start` - Start production server
- `npm run dev` - Start development server with hot reload (uses nodemon)
- `npm run lint` - Run ESLint code quality checks

### Database Setup
MongoDB must be running locally:
- Connection string: `mongodb://127.0.0.1:27017/wtwr_db`
- Windows: Check service with `sc query MongoDB` or `sc start MongoDB`
- Verify port: `netstat -an | findstr 27017`

### Environment Configuration
Create `.env` file based on `.env.example`:
- `FRONTEND_URL` - CORS configuration (defaults to `http://localhost:5173`)
- `PORT` - Server port (defaults to `3001`)
- `MONGODB_URI` - Database connection (defaults to local MongoDB)

## Code Architecture

### MVC Pattern
This is a standard Express.js REST API using the Model-View-Controller pattern:
- **Models** (`models/`) - Mongoose schemas with validation
- **Controllers** (`controllers/`) - Business logic and request handling
- **Routes** (`routes/`) - Express route definitions and endpoint mapping

### Error Handling System
The codebase uses a **centralized error handling approach**:
- All HTTP status codes and error messages are defined in `utils/constants.js`
- `mapErrorToResponse()` function automatically translates Mongoose errors to proper HTTP responses
- Mongoose `CastError` → 400 Bad Request (Invalid ID)
- Mongoose `ValidationError` → 400 Bad Request (Invalid Data)
- MongoDB duplicate key error (code 11000) → 409 Conflict
- Custom errors use `.statusCode` property and `.orFail()` pattern for 404s

**Pattern for controllers:**
```javascript
Model.findById(id)
  .orFail(() => {
    const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  })
  .then((result) => res.status(STATUS_CODES.OK).json(result))
  .catch((err) => {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    const { statusCode, message } = mapErrorToResponse(err);
    return res.status(statusCode).json({ message });
  });
```

### Data Models

**User Schema** (`models/user.js`):
- `name`: String (2-30 chars, required)
- `avatar`: String (valid URL, required)

**ClothingItem Schema** (`models/clothingItem.js`):
- `name`: String (2-30 chars, required)
- `weather`: Enum ['hot', 'warm', 'cold'] (required)
- `imageUrl`: String (valid URL, required)
- `owner`: ObjectId reference to User (required)
- `likes`: Array of ObjectId references to Users
- `createdAt`: Date (auto-generated)

### Temporary Authentication
**Important:** The app currently uses a temporary middleware in `app.js` (lines 42-47) that hardcodes a user ID for all requests:
```javascript
req.user = { _id: "6863bbc8eb627a884f678c38" };
```
This should be replaced with proper JWT authentication in the future. When implementing auth, remove this middleware and implement proper token verification.

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `POST /users` - Create new user (requires `name`, `avatar`)

### Clothing Items
- `GET /items` - Get all clothing items
- `POST /items` - Create new item (requires `name`, `weather`, `imageUrl`)
- `DELETE /items/:itemId` - Delete item by ID
- `PUT /items/:itemId/likes` - Like an item (uses `$addToSet` to prevent duplicates)
- `DELETE /items/:itemId/likes` - Unlike an item (uses `$pull`)

## Code Style

### ESLint Configuration
- Uses Airbnb base style guide + Prettier
- Special rules: `_id` is allowed (camelcase and no-underscore-dangle disabled for it)
- `no-console` is disabled (server logging is permitted)

### Async Patterns
- Controllers mix Promise chains (`.then()/.catch()`) and `async/await`
- Both patterns are acceptable, but be consistent within a single controller function
- Use `orFail()` for throwing 404 errors on missing resources

### Validation
- URL validation uses the `validator` package's `isURL()` function
- Schema validation is handled by Mongoose built-in validators
- Additional custom validation can be added in schema definitions

## Documentation References
- `docs/error-handling.md` - Detailed error handling implementation
- `docs/architecture.md` - (Currently empty, to be populated)
- `CONTRIBUTING.md` - Full API docs, data schemas, and contribution workflow
