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
  // change winston logging to allow comma-separate args
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
  const baseFormat = combine(
    format.splat(),
    format.simple(),
    timestamp(),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
  );
  const fileFormat = combine(fileFormatter);
  const consoleFormat = combine(format.colorize({ level: true }), consoleFormatter);

  const winstonLogger = createLogger({
    format: baseFormat,
    transports: [
      new transports.File({ filename: 'logs/info.log', level: 'info', options, format: fileFormat }),
      new transports.File({ filename: 'logs/debug.log', level: 'debug', options, format: fileFormat }),
      new transports.File({ filename: 'logs/silly.log', level: 'silly', options, format: fileFormat }),
      new transports.File({ filename: 'logs/warn.log', level: 'warn', options, format: fileFormat }),
      new transports.File({ filename: 'logs/error.log', level: 'error', options, format: fileFormat }),
      new transports.Console({ level: process.env.LOG_LEVEL || 'debug', format: consoleFormat })
    ]
  });

  const logger = {
    log: console.log,
    info: logFormatter((...args: any[]) => winstonLogger.info(args)),
    debug: logFormatter((...args: any[]) => winstonLogger.debug(args)),
    silly: logFormatter((...args: any[]) => winstonLogger.silly(args)),
    warn: logFormatter((...args: any[]) => winstonLogger.warn(args)),
    error: logFormatter((...args: any[]) => winstonLogger.error(args)),
    table: console.table
  }

  return logger;
}

/**
 * Overwrite the nodeJS console logging methods with a colourized winston logger.
 * This includes transports to three files in the app's root:  
 * * info.log
 * * debug.log
 * * warn.log
 * * error.log
 * 
 * @param  {boolean} [wipePreviousLogs=true] whether to wipe old logs on start-up or not
 * @param  {string}  [locale='en-GB'] the locale used to create timestamps
 */
export const overwriteConsole = (wipePreviousLogs=true, locale='en-GB') => {
  const logger = getLogger(wipePreviousLogs, locale);
  console.info = logger.info;
  console.debug = logger.debug;
  console.warn = logger.warn;
  console.error = logger.error;
}

export const logger = getLogger();
export const { log, info, debug, silly, warn, error, table } = logger;
