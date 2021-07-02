# DJ Logger

A simple typescript logger which wraps [winston](https://www.npmjs.com/package/winston). This package exports a `getLogger()` function.

## Overview

Logs are timestamped and coloured by log-level.
Output files are separated by log-level:
* info.log
* debug.log
* silly.log
Outputs are saved in the root of the project which imports the logger.

## Parameters

There are two _optional_ arguments which can be provided to `getLogger()`
* `wipePreviousLogs` (defaults to `true`)
* `locale` (defaults to `en-GB`)

### wipePreviousLogs
By default, when your app is started, the log files will be wiped clean; set this argument to false to keep previous logs.

### locale

This is solely used to format the timestamp used in the logs. If you are in a different time-zone, then you must set it for accurate timestamps.

## Example Usage

In thie example after getting a logger instance we overwrite the `console` methods, and then export them individually as functions with shorter names.

```typescript
const wipePreviousLogs = false;
const locale = 'de-DE';
const logger = getLogger(wipePreviousLogs, locale);

console.error = logFormatter(logger.error.bind(logger));
console.log = logFormatter(logger.info.bind(logger));
console.info = logFormatter(logger.info.bind(logger));
console.debug = logFormatter(logger.debug.bind(logger));
console.warn = logFormatter(logger.warn.bind(logger));

export const { log, info, debug, silly, warn, error, table } = logger;
```
