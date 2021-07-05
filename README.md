# @developerjake/djlogger
[![npm (scoped)](https://img.shields.io/npm/v/@developerjake/djlogger)](https://www.npmjs.com/package/@developerjake/djlogger) [![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/developerjake/djlogger/main)](https://github.com/developerjake/djlogger)

A simple collection of typescript logging tools using [winston](https://www.npmjs.com/package/winston) - adds timestamps, colours, and outputs your logs into a `logs` directory in the root of your project.

## Overview
This is a minimalist set of utilities that can be imported and used within a few seconds to get considerably more useful logging into an application as you build it - nothing more. You'll probably want to replace it down the line. This is just a convenience tool to hit the ground running.

Log files saved into the `logs` directory in the root of your project are named intuitively:
* info.log
* debug.log
* silly.log
* warn.log
* error.log

Logging to the terminal is timestamped (does not include the date) and includes the colourized log-level.
Logs output to file include the full date & timestamp, and the log level.
Any objects logged are stringified.

## `log` and `table`
These two methods are excluded from the file-logging outputs. If, for  whatever reason, you fancy logging something to the console but don't want it to be output into the logging files, you can call `log`.

## Ready-Steady-Go
1. Install the package with one of these depending on your preferred package manager:
	* `npm install @developerjake/djlogger`
	* `yarn add @developerjake/djlogger`
2. Import what you need (see [examples](#example-usage)) and start using it.

## Configuration
Everything works out of the box; these conflagration options are optional.

### Set  the logging level (Optional)
* Use a variable in a `.env` file  in the root of your project
* If not set, logging level defaults to `debug`
```
LOG_LEVEL=silly
```
Options are `info`, `debug`, `silly`, `warn` and `error`.

### Change your locale (Optional)
The locale defaults to `en-GB`. If you want a different one, [see this example](#logger-instance-with-custom-configuration) on how to set it.

### Keep old logs (Optional)
By default each time you restart your app the old log files are nuked. Why? Well, because that's my preference. To change this behaviour to keep your logs between restarts [see this example](#logger-instance-with-custom-configuration).

## Public API
This package exposes the following.

### A logger instance
*  `logger`
### A method which returns a logger instance
*  `getLogger(wipePreviousLogs=true, locale='en-GB')`
### A method which overwrites the NodeJS Console logging methods
*  `overwriteConsole(wipePreviousLogs=true, locale='en-GB')`
### Logging methods
*  `log`
*  `info`
*  `debug`
*  `silly`
*  `warn`
*  `error`
*  `table`

**NOTE** using `log()` or `table()` will not persist the logs to a log-file.

## Gatcha

**Do not** use both of the instance logging methods and the overwritten console methods together - doing so will result in small chunks of the logs in the log-files being discarded. 

**Stick to one method** - either use `overwriteConsole()` and use the `console` logging methods, _or_ import the `logger` or it's instance logging methods such as `info` and `debug`.

## Example Usage
### Logger instance with default configuration
```typescript
import { logger } from '@developerjake/djlogger';

logger.info('Frontend? 🤔 Backend? 🙄 Weekend? 😁');
```

### Logger instance with custom configuration
```typescript
import { getLogger } from '@developerjake/djlogger';

const wipePreviousLogs = false;
const locale = 'de-DE';
const logger = getLogger(wipePreviousLogs, locale);

logger.warn('warning❗'); // 07:44:12 warn: warning❗
```

### Overwrite the NodeJS Console logging methods
```typescript
import { overwriteConsole } from '@developerjake/djlogger';

overWriteConsole(undefined, 'ja-JP-u-ca-japanese');

console.info('🔒 locked');              // 14:26:33 info: 🔒 locked
console.debug('🔓 unlocked');           // 14:26:33 debug: 🔓 unlocked
console.log('🔏 lock & fountain pen?'); // 🔏 lock & fountain pen?
```

### Individual logging level methods
```typescript
import { table, error, debug } from '@developerjake/djlogger';

const crypto = Object.fromEntries([
  ['BTC', 'the future'],
  ['DOGE', 'meme trash']
]);

try {
  info(crypto); // 04:12:54 info: {"BTC":"the future","DOGE":"meme trash"}
  table(crypto); // <a nice table 🙂> (no timestamp or log-level)
} catch (e: Error) {
  error(`💥 Ka-blamo`, e.message);
  debug(e.stack);
}
```
