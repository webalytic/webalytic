# Webalytic/data-storage

The service is responsible for the following:

-  subscribe on events from [log-processing](../log-processing/README.md) service, write all data to database
- provide API for QueryEngine base on [Cube.JS](https://cube.dev)

---
## Package.json scripts

```bash
# Start main process: consumer, handler and producer 
yarn start

# Run test, unit + integration
yarn test

# Run unit tests
yarn test:unit

# Run integration tests
yarn test:integration

# Run unit test with coverage report 
yarn coverage

# Check EsLint
yarn lint

# Check TypeScript
yarn ts-check
```