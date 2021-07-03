# @developerjake/djlogger
[![npm (scoped)](https://img.shields.io/npm/v/@developerjake/djlogger)](https://www.npmjs.com/package/@developerjake/djlogger) [![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/developerjake/djlogger/main)](https://github.com/developerjake/djlogger)

A simple collection of typescript logging tools using [winston](https://www.npmjs.com/package/winston) - adds timestamps, colours, and outputs your logs into a `logs` directory in the root of your project.
## Overview
This is a minimalist set of utilities that can be imported and used within a few seconds to get considerably more useful logging into an application as you build it - nothing more. You'll probably want to replace it down the line. This is just a convenience tool to hit the ground running.

Log files saved into the `logs` directory in the root of your project are named intuitively:
* info.log
* debug.log
* silly.log

All logs will be timestamped (does not include the date).
Logging in the terminal will have the log-level printed and colourized.
## Ready-Steady-Go
1. Install the package with one of these depending on your preferred package manager:
	* `npm install @developerjake/djlogger`
	* `yarn add @developerjake/djlogger`
2. Import what you need (see [examples](#example-usage)) and start using it.
## Configuration
Everything works just fine out of the box. These conflagration options are all optional.
### Set  the logging level (Optional)
* Use a variable in a `.env` file  in the root of your project
* If not set, logging level defaults to `debug`
```
LOG_LEVEL=silly
```
Options are `info`, `debug`, and `silly`.
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

## Example Usage
### Logger instance with default configuration
```typescript
import { logger } from 'djlogger';

logger.info('Frontend? 🤔 Backend? 🙄 Weekend? 😁');
```
### Logger instance with custom configuration
```typescript
import { getLogger } from 'djlogger';

const wipePreviousLogs = false;
const locale = 'de-DE';
const logger = getLogger(wipePreviousLogs, locale);

logger.warn('warning❗'); // 07:44:12 warn: warning❗
```
### Overwrite the NodeJS Console logging methods
```typescript
import { overwriteConsole } from 'djlogger';

overWriteConsole(undefined, 'ja-JP-u-ca-japanese');

console.log('🔒 locked'); // 14:26:33 info: 🔒 locked
```
### Individual logging level methods
```typescript
import { table, error, debug } from 'djlogger';

const stuff = [
  ['BTC', 'amazing'],
  ['ETH', 'defi-tacular'],
  ['DOGE', 'meme-trash']
];

try {
  table(stuff);
} catch (e: Error) {
  error(`💥 Ka-blamo`, e.message);
  debug(e.stack);
}
```
