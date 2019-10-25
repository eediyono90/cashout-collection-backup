import * as Winston from 'winston';

export class LoggerFactory
{
	private static _winstonLogger: Winston.Logger;
    private static readonly logFiles = 'logs/app.log';
    public static getLogger(): Winston.Logger
    {
        if (!LoggerFactory._winstonLogger) {
            LoggerFactory._winstonLogger = Winston.createLogger({
                format: Winston.format.combine(
                    Winston.format.timestamp(),
                    Winston.format.printf(({level, message, label, timestamp }) => {
                        return `${timestamp} [${level}] : ${message}`;
                    })
                ),
                level: 'debug',
                transports: [
                    new Winston.transports.Console()
                ]
            });
        }
        return LoggerFactory._winstonLogger;
    }
    public static addFileLogger(logfilePath: string, logLevel = 'error'): Winston.Logger
    {
        if (!LoggerFactory._winstonLogger) {
            LoggerFactory._winstonLogger = LoggerFactory.getLogger();
        }
        LoggerFactory._winstonLogger.add(
            new Winston.transports.File({filename: logfilePath, level: logLevel})
        );
        return LoggerFactory._winstonLogger;
    }
}

export { Logger } from 'winston';
