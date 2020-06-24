# Lambda Logger
[![npm version](https://badge.fury.io/js/%40wpkyoto%2Flambda-logger.svg)](https://badge.fury.io/js/%40wpkyoto%2Flambda-logger)
[![npm version](https://nodei.co/npm/@wpkyoto/lambda-logger.png)](https://badge.fury.io/js/%40wpkyoto%2Flambda-logger)

## Getting started

```bash
$ npm i -S @wpkyoto/lambda-logger
```

## Usage

### TSLogger wrapper

```typescript
import { TSLoggerService } from '@wpkyoto/lambda-logger'

const { logger } = TSLoggerService()
logger.info()
logger.silly()
logger.debug()
logger.error()
logger.fatal()
```