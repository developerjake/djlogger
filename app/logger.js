"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.table = exports.error = exports.warn = exports.silly = exports.debug = exports.info = exports.log = exports.logger = exports.overwriteConsole = exports.getLogger = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const winston_1 = require("winston");
const env = dotenv_1.default.config();
if (env.error) {
    console.warn('Cannot find .env file; it needs to be in "service/"');
    console.error(env.error.message);
}
else if (!process.env.LOG_LEVEL) {
    console.warn('No LOG_LEVEL defined in environment variables');
}
const { combine, timestamp, printf } = winston_1.format;
const logFormatter = (logFunction) => {
    return (...args) => {
        const strings = [];
        const objs = [];
        let index = 0;
        args.forEach(arg => {
            if (typeof arg === 'object') {
                objs.push(arg);
                ++index;
            }
            else if (arg?.toString) {
                if (strings[index])
                    strings[index] += ` ${arg.toString()}`;
                else
                    strings[index] = `${arg.toString()}`;
            }
            else if (arg) {
                if (strings[index])
                    strings[index] += ` ${arg}`;
                else
                    strings[index] = `${arg}`;
            }
        });
        for (let i = 0; i < index + 1; i++) {
            if (strings[i])
                logFunction(strings[i]);
            if (objs[i])
                logFunction(objs[i]);
        }
    };
};
const getLogger = (wipePreviousLogs = true, locale = 'en-GB') => {
    const options = { ...(wipePreviousLogs && { flags: 'w' }) };
    const formatter = printf(({ level, message, timestamp }) => {
        return `${new Date(timestamp).toLocaleTimeString(locale)} ${level}: ${message}`;
    });
    const winstonLogger = winston_1.createLogger({
        level: 'info',
        format: combine(winston_1.format.splat(), winston_1.format.simple(), winston_1.format.colorize(), timestamp(), formatter),
        transports: [
            new winston_1.transports.File({ filename: 'logs/info.log', level: 'info', options }),
            new winston_1.transports.File({ filename: 'logs/debug.log', level: 'debug', options }),
            new winston_1.transports.File({ filename: 'logs/silly.log', level: 'silly', options }),
            new winston_1.transports.Console({ level: process.env.LOG_LEVEL || 'debug' })
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
    };
    return logger;
};
exports.getLogger = getLogger;
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
const overwriteConsole = (wipePreviousLogs = true, locale = 'en-GB') => {
    const logger = exports.getLogger(wipePreviousLogs, locale);
    console.error = logFormatter(logger.error.bind(logger));
    console.log = logFormatter(logger.info.bind(logger));
    console.info = logFormatter(logger.info.bind(logger));
    console.debug = logFormatter(logger.debug.bind(logger));
    console.warn = logFormatter(logger.warn.bind(logger));
};
exports.overwriteConsole = overwriteConsole;
exports.logger = exports.getLogger();
exports.log = exports.logger.log, exports.info = exports.logger.info, exports.debug = exports.logger.debug, exports.silly = exports.logger.silly, exports.warn = exports.logger.warn, exports.error = exports.logger.error, exports.table = exports.logger.table;
