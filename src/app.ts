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
  return(...args: any[]) => {
    const strings: string[] = [];
    const objs: any[] = [];
    let index = 0;
    args.forEach(arg => {
      if (typeof arg === 'object') {
        objs.push(arg);
        ++index;
      } else if (arg?.toString) {
        if (strings[index]) strings[index] += ` ${arg.toString()}`;
        else strings[index] = `${arg.toString()}`;
      } else if (arg) {
        if (strings[index]) strings[index] += ` ${arg}`;
        else strings[index] = `${arg}`;
      }
    });
    for (let i = 0; i < index + 1; i++) {
      if (strings[i]) logFunction(strings[i]);
      if (objs[i]) logFunction(objs[i]);
    }
  }
}

export const getLogger = (wipePreviousLogs = true, locale = 'en-GB'): Logger => {
  const options = { ...(wipePreviousLogs && { flags: 'w' }) };

  const formatter = printf(({ level, message, timestamp }) => {
    return `${new Date(timestamp).toLocaleTimeString(locale)} ${level}: ${message}`;
  });  

  const winstonLogger = createLogger({
    level: 'info',
    format: combine(
      format.splat(),
      format.simple(),
      format.colorize(),
      timestamp(),
      formatter
    ),
    transports: [
      new transports.File({ filename: 'logs/info.log', level: 'info', options }),
      new transports.File({ filename: 'logs/debug.log', level: 'debug', options }),
      new transports.File({ filename: 'logs/silly.log', level: 'silly', options }),
      new transports.Console({ level: process.env.LOG_LEVEL || 'debug' })
    ]
  });

  const logger = {
    log: logFormatter(winstonLogger.info.bind(winstonLogger)),
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
  console.log = logFormatter(logger.info.bind(logger));
  console.info = logFormatter(logger.info.bind(logger));
  console.debug = logFormatter(logger.debug.bind(logger));
  console.warn = logFormatter(logger.warn.bind(logger));
}

export const logger = getLogger();
export const { log, info, debug, silly, warn, error, table } = logger;
