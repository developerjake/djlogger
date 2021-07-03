import dotenv from 'dotenv';
import { createLogger, format, LeveledLogMethod, transports } from 'winston';

interface Logger {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  silly: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  table: (tabularData: any, properties?: readonly string[]) => void;
}

const env = dotenv.config();
if (env.error) {
  console.warn('Cannot find .env file; it needs to be in "service/"');
  console.error(env.error.message);
} else if (!process.env.LOG_LEVEL) {
  console.warn('No LOG_LEVEL defined in environment variables');
}

const { combine, timestamp, printf } = format;

const logFormatter = (logFunction: LeveledLogMethod) => {
  // winston can't handle comma-separated logging
  return(...args: any[]) => {
    const result: string[] = [];
    args.forEach(arg => {
        if (typeof arg === 'object') result.push(JSON.stringify(arg))
        else if (arg?.toString) result.push(`${arg.toString()}`)
        else if (arg) result.push(arg);
    });
    logFunction(result.join(' '));
  };
}

export const getLogger = (wipePreviousLogs = true, locale = 'en-GB'): Logger => {
  const options = { ...(wipePreviousLogs && { flags: 'w' }) };

  const consoleFormatter = printf(({ level, message, timestamp }) =>
    `${new Date(timestamp).toLocaleTimeString(locale)} ${level.padStart(15)}: ${message}`);  

  const fileFormatter = printf(({ level, message, timestamp }) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString(locale);
    const timeString = date.toLocaleTimeString(locale);
    return `${dateString} ${timeString} ${level.padStart(5)}: ${message}`;
  });

  const fileFormat = combine(fileFormatter);
  const consoleFormat = combine(format.colorize({ level: true }), consoleFormatter);

  const winstonLogger = createLogger({
    level: 'info',
    format: combine(format.splat(), format.simple(), timestamp()),
    transports: [
      new transports.File({ filename: 'logs/info.log', level: 'info', options, format: fileFormat }),
      new transports.File({ filename: 'logs/debug.log', level: 'debug', options, format: fileFormat }),
      new transports.File({ filename: 'logs/silly.log', level: 'silly', options, format: fileFormat }),
      new transports.Console({ level: process.env.LOG_LEVEL || 'debug', format: consoleFormat })
    ]
  });

  const logger = {
    log: console.log,
    info: logFormatter(winstonLogger.info.bind(winstonLogger)),
    debug: logFormatter(winstonLogger.debug.bind(winstonLogger)),
    silly: logFormatter(winstonLogger.silly.bind(winstonLogger)),
    warn: logFormatter(winstonLogger.warn.bind(winstonLogger)),
    error: logFormatter(winstonLogger.error.bind(winstonLogger)),
    table: console.table
  }

  return logger;
}

/**
 * Overwrite the nodeJS console logging methods with a colourized winston logger.
 * This includes transports to three files in the app's root:  
 * * info.log
 * * debug.log
 * * silly.log
 * 
 * @param  {boolean} [wipePreviousLogs=true] whether to wipe old logs on start-up or not
 * @param  {string}  [locale='en-GB'] the locale used to create timestamps
 */
export const overwriteConsole = (wipePreviousLogs = true, locale = 'en-GB') => {
  const logger = getLogger(wipePreviousLogs, locale);

  console.error = logFormatter(logger.error.bind(logger));
  console.info = logFormatter(logger.info.bind(logger));
  console.debug = logFormatter(logger.debug.bind(logger));
  console.warn = logFormatter(logger.warn.bind(logger));
}

export const logger = getLogger();
export const { log, info, debug, silly, warn, error, table } = logger;
