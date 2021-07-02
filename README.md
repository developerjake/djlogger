# DJ Logger

Some simple typescript logging tools using [winston](https://www.npmjs.com/package/winston). 

## Overview

Logs are timestamped and coloured by log-level and log files are saved in the root of the project, separated by log-level:
* info.log
* debug.log
* silly.log

## Configuration

This package searches for a `.env` files in the root of the app with a `LOG_LEVEL` variable. If not set, logging defaults to `debug`. The standard options of `info`, `debug`, etc. are available.

By default, the logger and logging methods herein will wipe down old log files each time your app is started, and the 'en-GB' locale will be used for timestamps.

This can be changed with parameters available as shown in the public API.

## Public API

A logger instance using the default configuration:
* `logger`

A method to obtain a logger with custom options:
* `getLogger(wipePreviousLogs = true, locale = 'en-GB')`

Instead of importing and using a logger or logging-methods, this can be called to overwrite all built-in NodeJS console-logging methods to make them use winston and save logs to files:
* `overWriteConsole(wipePreviousLogs = true, locale = 'en-GB')`

Alternately, individual logging methods using the default configuation can be imported:
* `log`
* `info`
* `debug`
* `silly`
* `warn`
* `error`
* `table`

## Examples

```typescript
import { getLogger } from 'djlogger';

const wipePreviousLogs = false;
const locale = 'de-DE';
const logger = getLogger(wipePreviousLogs, locale);

logger.warn('warning❗'); // 07:44:12 warn: warning❗
```

```typescript
import { overwriteConsole } from 'djlogger';

overWriteConsole(undefined, 'ja-JP-u-ca-japanese');

console.log('🔒 locked'); // 14:26:33 info: 🔒 locked
```

```typescript
import { table } from 'djlogger';

const stuff = [
  ['BTC', 'amazing'],
  ['ETH', 'defi-tacular'],
  ['DOGE', 'meme-trash']
]

table(stuff);
```
