# Testing

This project uses Jest for testing with MongoDB Memory Server for database isolation.

## Test Structure

```
tests/
├── setup/
│   ├── testDb.js       # MongoDB Memory Server configuration
│   ├── testSetup.js    # Jest setup hooks
│   └── testApp.js      # Test Express app factory
├── unit/
│   └── utils/          # Unit tests for utility functions
└── integration/
    ├── models/         # Model validation tests
    └── routes/         # API endpoint tests
```

## Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

## Requirements

The tests use `mongodb-memory-server` which downloads a MongoDB binary on first run.

### Environment Variables (optional)

- `MONGOMS_VERSION`: MongoDB version to use (default: 7.0.4)
- `MONGOMS_DOWNLOAD_DIR`: Directory for MongoDB binaries (default: /tmp/mongodb-binaries)

### Troubleshooting

If you encounter download errors for MongoDB binaries:

1. **Network restrictions**: Ensure you can access `https://fastdl.mongodb.org`
2. **Pre-install binary**: Run `npx mongodb-memory-server-core download` before testing
3. **Use local MongoDB**: Set `MONGOMS_SYSTEM_BINARY=/path/to/mongod` to use a local installation

## Test Coverage

The tests cover:

- **Utils**: Error mapping functions, constants validation
- **Models**: User and ClothingItem schema validation, CRUD operations
- **Routes**: All API endpoints including error handling

### Coverage Targets

| Category | Target |
|----------|--------|
| Statements | 80% |
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |
