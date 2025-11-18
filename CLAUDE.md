# CLAUDE.md - AI Assistant Guide for WTWR Express API

## Project Overview

**Project Name**: WTWR (What to Wear?) Express API
**Type**: RESTful backend API
**Purpose**: Server for managing users and clothing items based on weather conditions
**Author**: Darien Johnas
**Current Sprint**: 12

This is a Node.js/Express backend application with MongoDB that provides API endpoints for user management and clothing item operations. The project is part of a learning curriculum focused on backend development, database management, security, and deployment.

---

## Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime environment |
| **Framework** | Express.js 4.21.2 | Web application framework |
| **Database** | MongoDB | NoSQL database |
| **ODM** | Mongoose 8.16.1 | MongoDB object modeling |
| **Validation** | Validator 13.15.15 | URL and data validation |
| **Security** | Helmet 8.1.0 | HTTP security headers |
| **CORS** | cors | Cross-origin resource sharing |
| **Linting** | ESLint 8.57.1 | Code quality and style enforcement |
| **Code Style** | Prettier 2.8.8 | Code formatting |
| **Dev Tools** | Nodemon 3.1.10 | Hot reload during development |

---

## Project Structure

```
se_project_express/
├── app.js                          # Main application entry point
├── package.json                    # Dependencies and npm scripts
├── .eslintrc.js                   # ESLint configuration (Airbnb + Prettier)
├── .editorconfig                  # Editor configuration
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore patterns
├── sprint.txt                     # Current sprint number (12)
│
├── models/                        # Mongoose schemas and models
│   ├── user.js                   # User model with validation
│   └── clothingItem.js           # Clothing item model
│
├── routes/                        # Express route definitions
│   ├── index.js                  # Main router with 404 handling
│   ├── users.js                  # User-related routes
│   └── clothingItems.js          # Clothing item routes
│
├── controllers/                   # Route handler logic
│   ├── users.js                  # User controller functions
│   └── clothingItems.js          # Clothing item controllers
│
├── utils/                         # Utility modules
│   ├── constants.js              # HTTP status codes and error mapping
│   └── errors.js                 # Error message definitions
│
├── docs/                          # Documentation
│   ├── architecture.md           # (Empty - to be populated)
│   └── error-handling.md         # Comprehensive error handling guide
│
├── .github/                       # GitHub configuration
│   ├── workflows/
│   │   ├── tests-12.yml         # Sprint 12 CI/CD tests
│   │   └── tests-13.yml         # Sprint 13 CI/CD tests
│   └── bin/
│       └── check-sprint.sh      # Sprint validation script
│
├── CONTRIBUTING.md               # Contribution guidelines and API docs
├── README.md                     # Project setup and overview
└── local-env.postman_environment.json  # Postman environment config
```

---

## Key Architectural Patterns

### 1. MVC Architecture (Modified)

- **Models** (`models/`): Mongoose schemas defining data structure and validation
- **Controllers** (`controllers/`): Business logic and request handling
- **Routes** (`routes/`): Endpoint definitions and controller mapping
- **No Views**: This is a pure API server (JSON responses only)

### 2. Centralized Error Handling

The project uses a sophisticated centralized error handling system:

**Core Components:**
- `utils/errors.js` - Defines all error message constants
- `utils/constants.js` - Defines HTTP status codes and `mapErrorToResponse()` function
- Error mapping automatically translates Mongoose errors to HTTP responses

**Error Mapping Strategy:**

| Error Type | Status Code | Message Constant |
|------------|-------------|------------------|
| `CastError` | 400 | `INVALID_ID` |
| `ValidationError` | 400 | `INVALID_DATA` |
| `MongoError 11000` | 409 | `DUPLICATE_ENTRY` |
| Custom errors | As specified | Custom message |
| Unknown errors | 500 | `GENERIC_SERVER_ERROR` |

**Controller Error Handling Pattern:**
```javascript
// For queries that might not find a resource
Model.findById(id)
  .orFail(() => {
    const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error;
  })
  .then((data) => res.status(STATUS_CODES.OK).json(data))
  .catch((err) => {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    const { statusCode, message } = mapErrorToResponse(err);
    return res.status(statusCode).json({ message });
  });
```

### 3. Promise-Based and Async/Await Pattern

Controllers use a **mix of patterns**:
- **Promise chains** (`.then()/.catch()`): Most controllers (users.js, clothingItems.js)
- **Async/await**: Some functions (e.g., `getClothingItems`)

**When modifying code, maintain consistency with the existing pattern in that file.**

### 4. Temporary Authentication

**IMPORTANT**: The app currently uses a **hardcoded test user ID** for authentication:

```javascript
// app.js lines 42-47
app.use((req, res, next) => {
  req.user = {
    _id: "6863bbc8eb627a884f678c38", // Test user ID
  };
  next();
});
```

This middleware is temporary and should be replaced with proper JWT authentication in future sprints.

---

## Data Models

### User Schema (`models/user.js`)

```javascript
{
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: true,
    validate: validator.isURL  // Must be valid URL
  }
}
```

### Clothing Item Schema (`models/clothingItem.js`)

```javascript
{
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"]
  },
  imageUrl: {
    type: String,
    required: true,
    validate: validator.isURL
  },
  owner: {
    type: ObjectId,
    ref: "user",
    required: true
  },
  likes: {
    type: [ObjectId],
    ref: "user",
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `POST /users` - Create new user

### Clothing Items
- `GET /items` - Get all clothing items
- `POST /items` - Create new clothing item (uses `req.user._id` as owner)
- `DELETE /items/:itemId` - Delete clothing item by ID
- `PUT /items/:itemId/likes` - Like a clothing item
- `DELETE /items/:itemId/likes` - Unlike a clothing item

### Error Handling
- `*` (all non-existent routes) - Returns 404 with `RESOURCE_NOT_FOUND` message

---

## Environment Configuration

### Required Environment Variables

```bash
PORT=3001                                    # Server port (default: 3001)
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db  # MongoDB connection string (default shown)
FRONTEND_URL=http://localhost:5173           # CORS allowed origin (default shown)
```

**Configuration precedence:**
1. Environment variables (`.env` file or system env)
2. Hardcoded defaults in `app.js`

### MongoDB Configuration

- **Default URI**: `mongodb://127.0.0.1:27017/wtwr_db`
- **Database name**: `wtwr_db`
- **Connection**: Handled in `app.js` lines 33-36

---

## Development Workflow

### NPM Scripts

```bash
npm run start    # Start server in production mode (node app.js)
npm run dev      # Start with hot reload (nodemon app.js)
npm run lint     # Run ESLint to check code quality
```

### Code Style Guidelines

**ESLint Configuration** (`.eslintrc.js`):
- Base: `eslint:recommended`, `airbnb-base`, `prettier`
- Environment: Node.js ES2021
- Special rules:
  - `camelcase`: Error, but allow `_id`
  - `no-console`: Off (console logs allowed)
  - `no-underscore-dangle`: Error, but allow `_id`

**EditorConfig** (`.editorconfig`):
- Indent: 2 spaces
- Line endings: LF
- Charset: UTF-8
- Trim trailing whitespace: true (except `.md` files)
- Insert final newline: true

### Git Workflow

**Branch Strategy:**
- Main branch: `main` (implied from workflows)
- Feature branches: Create from `main`
- AI assistants should work on branches like: `claude/claude-md-*`

**Commit Message Format:**
- `feat: description` - New feature
- `fix: description` - Bug fix
- `docs: description` - Documentation
- `refactor: description` - Code refactoring
- `test: description` - Tests
- `chore: description` - Maintenance

### CI/CD Pipeline

**GitHub Actions Workflows:**

1. **Sprint Detection** (`read_sprint_file` job):
   - Reads `sprint.txt` to determine current sprint
   - Runs appropriate test suite based on sprint number

2. **Sprint 12 Tests** (`tests-12.yml`):
   - Triggered when `sprint.txt` contains `12`

3. **Sprint 13 Tests** (`tests-13.yml`):
   - Config validation (`test_config`)
   - Endpoint testing (`test_endpoints`)
   - Uses MongoDB 4.4
   - Waits for server on port 3001

---

## AI Assistant Guidelines

### When Adding New Features

1. **Follow existing patterns**:
   - Use the same error handling approach (constants + mapErrorToResponse)
   - Maintain consistency with promise chains vs async/await in the same file
   - Follow the controller → route → export pattern

2. **Error handling checklist**:
   - [ ] Add error messages to `utils/errors.js` if needed
   - [ ] Use `mapErrorToResponse()` for database errors
   - [ ] Use custom errors with `statusCode` property for business logic errors
   - [ ] Return consistent JSON: `{ message: "..." }`

3. **Data validation**:
   - [ ] Add Mongoose schema validation in models
   - [ ] Use `validator` package for URL validation
   - [ ] Set appropriate min/max lengths
   - [ ] Use enum for restricted values

4. **Testing**:
   - [ ] Test with invalid IDs (should return 400)
   - [ ] Test with non-existent resources (should return 404)
   - [ ] Test with invalid data (should return 400)
   - [ ] Test with valid data (should return 200/201)

### When Modifying Code

1. **Always read the file first** before editing
2. **Run linter** after changes: `npm run lint`
3. **Update documentation** if changing:
   - API endpoints
   - Data models
   - Error handling patterns
   - Environment variables

### Common Gotchas

1. **MongoDB ObjectId validation**:
   - Invalid ObjectId format triggers `CastError` → 400 Bad Request
   - Use `.orFail()` to catch non-existent documents → 404 Not Found

2. **User authentication**:
   - Currently uses hardcoded `req.user._id = "6863bbc8eb627a884f678c38"`
   - DO NOT modify this middleware unless implementing actual auth

3. **CORS configuration**:
   - Backend allows `FRONTEND_URL` or defaults to `http://localhost:5173`
   - Update `.env` for production deployments

4. **ESLint and `_id`**:
   - `_id` is explicitly allowed in camelcase and no-underscore-dangle rules
   - This is required for MongoDB's default ID field

### File Modification Priorities

**High Impact** (review carefully):
- `app.js` - Main application setup
- `utils/constants.js` - Error handling core
- Models - Data structure changes

**Medium Impact**:
- Controllers - Business logic
- Routes - API endpoints

**Low Impact**:
- `utils/errors.js` - Error messages (but update often)
- Documentation files

---

## Testing and Debugging

### Manual Testing with cURL

```bash
# Get all users
curl http://localhost:3001/users

# Create a user
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "avatar": "https://example.com/avatar.jpg"}'

# Get a specific user
curl http://localhost:3001/users/USER_ID

# Create a clothing item
curl -X POST http://localhost:3001/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Winter Jacket", "weather": "cold", "imageUrl": "https://example.com/jacket.jpg"}'

# Like an item
curl -X PUT http://localhost:3001/items/ITEM_ID/likes

# Delete an item
curl -X DELETE http://localhost:3001/items/ITEM_ID
```

### Debugging Checklist

1. **Server won't start**:
   - [ ] Check if port 3001 is available: `tasklist | grep node`
   - [ ] Verify MongoDB is running: `sc query MongoDB`
   - [ ] Check MongoDB connection string in environment

2. **400 Bad Request**:
   - [ ] Validate request body matches schema
   - [ ] Check required fields are present
   - [ ] Verify URLs are valid format
   - [ ] Ensure `weather` enum is one of: hot, warm, cold

3. **404 Not Found**:
   - [ ] Verify resource ID exists in database
   - [ ] Check ID format is valid MongoDB ObjectId

4. **500 Internal Server Error**:
   - [ ] Check server console for detailed stack trace
   - [ ] Verify MongoDB connection is active
   - [ ] Review recent code changes

---

## Documentation References

| Document | Purpose |
|----------|---------|
| `README.md` | Setup instructions, troubleshooting, quick start |
| `CONTRIBUTING.md` | API endpoints, data schemas, contribution workflow |
| `docs/error-handling.md` | Detailed error handling implementation and philosophy |
| `docs/architecture.md` | (Empty - to be populated with architectural decisions) |
| `.env.example` | Environment variable template |

---

## Future Development (Upcoming Sprints)

Based on project structure and current sprint (12), anticipated changes:

1. **Authentication & Authorization** (likely Sprint 13+):
   - Replace temporary user middleware with JWT
   - Add login/signup endpoints
   - Implement authorization for delete/update operations

2. **Enhanced Validation**:
   - More sophisticated input validation
   - Custom validation messages

3. **Testing**:
   - Unit tests (Jest/Mocha)
   - Integration tests
   - Test coverage reporting

4. **Deployment**:
   - Production MongoDB setup
   - Environment-specific configurations
   - Cloud deployment (likely mentioned in curriculum)

---

## Quick Reference: Important File Locations

| What to modify | File path |
|---------------|-----------|
| Add HTTP status code | `utils/constants.js` |
| Add error message | `utils/errors.js` |
| Modify error mapping | `utils/constants.js` → `mapErrorToResponse()` |
| Add user endpoint | `routes/users.js` + `controllers/users.js` |
| Add item endpoint | `routes/clothingItems.js` + `controllers/clothingItems.js` |
| Change user schema | `models/user.js` |
| Change item schema | `models/clothingItem.js` |
| Modify middleware | `app.js` |
| Update CORS | `app.js` (lines 25-30) |
| Change port/MongoDB | `.env` or `app.js` (lines 13-16) |

---

## Code Examples for Common Tasks

### Adding a New Error Message

1. Add to `utils/errors.js`:
```javascript
const ERROR_MESSAGES = {
  // ... existing messages
  NEW_ERROR: "Your error message here",
};
```

2. Use in controller:
```javascript
const error = new Error(ERROR_MESSAGES.NEW_ERROR);
error.statusCode = STATUS_CODES.BAD_REQUEST;
throw error;
```

### Creating a New Controller Function

```javascript
// controllers/example.js
const { STATUS_CODES, ERROR_MESSAGES, mapErrorToResponse } = require("../utils/constants");

function exampleFunction(req, res) {
  const { paramId } = req.params;

  Model.findById(paramId)
    .orFail(() => {
      const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      error.statusCode = STATUS_CODES.NOT_FOUND;
      throw error;
    })
    .then((data) => res.status(STATUS_CODES.OK).json(data))
    .catch((err) => {
      if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      const { statusCode, message } = mapErrorToResponse(err);
      return res.status(statusCode).json({ message });
    });
}

module.exports = { exampleFunction };
```

### Adding a New Route

```javascript
// routes/example.js
const router = require("express").Router();
const { exampleFunction } = require("../controllers/example");

router.get("/:paramId", exampleFunction);

module.exports = router;
```

Then register in `routes/index.js`:
```javascript
const exampleRouter = require("./example");
router.use("/example", exampleRouter);
```

---

## Troubleshooting Commands

```bash
# Check Node processes
tasklist | grep node

# Kill all Node processes (Windows)
powershell "Stop-Process -Name node -Force"

# Check MongoDB status (Windows)
sc query MongoDB

# Start MongoDB (Windows)
sc start MongoDB

# Check port 3001 usage
netstat -an | findstr 3001

# Check MongoDB port
netstat -an | findstr 27017

# View MongoDB logs (Windows)
type "C:\Program Files\MongoDB\Server\8.0\log\mongod.log"
```

---

## Security Considerations

1. **Helmet**: Enabled for security headers (CSP, HSTS, etc.)
2. **X-Powered-By**: Disabled to reduce server fingerprinting
3. **CORS**: Configured to specific frontend URL
4. **Validation**: URL validation using `validator` package
5. **MongoDB Injection**: Mongoose provides protection by default

**Future considerations**:
- Input sanitization
- Rate limiting
- JWT authentication
- HTTPS enforcement
- Environment variable validation

---

## Final Notes for AI Assistants

1. **Always run `npm run lint`** before committing changes
2. **Test endpoints manually** with cURL or Postman after changes
3. **Follow the existing code patterns** - consistency is key
4. **Update this CLAUDE.md** when you discover new patterns or make structural changes
5. **Check `sprint.txt`** to understand which test suite will run
6. **Don't modify the test user middleware** unless explicitly requested
7. **Use the centralized error handling system** - don't create ad-hoc error responses

---

**Last Updated**: 2025-11-18
**Sprint**: 12
**Node Version**: 20.x (from CI/CD)
**MongoDB Version**: 4.4 (from CI/CD)
