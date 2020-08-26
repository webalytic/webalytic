# Webalytic/log-processing

Service subscribe on events from log-collector service, handle all hits, create and update sessions, parse Geo, User-Agent etc.., and as result sending events **LogProcessed**

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
