# Lambda Logger

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