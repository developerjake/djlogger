interface Logger {
    log: (...args: any[]) => void;
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    silly: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    table: (tabularData: any, properties?: readonly string[]) => void;
}
export declare const getLogger: (wipePreviousLogs?: boolean, locale?: string) => Logger;
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
export declare const overwriteConsole: (wipePreviousLogs?: boolean, locale?: string) => void;
export declare const logger: Logger;
export declare const log: (...args: any[]) => void, info: (...args: any[]) => void, debug: (...args: any[]) => void, silly: (...args: any[]) => void, warn: (...args: any[]) => void, error: (...args: any[]) => void, table: (tabularData: any, properties?: readonly string[]) => void;
export {};
