import winston from "winston";
import config from "./config";

const format = winston.format.printf(
    ({ level, message, timestamp, label }) => `${timestamp} - [${label}] ${level}: ${message}`
);

const errorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const log = winston.createLogger({
    level: config.logger.level,
    format: winston.format.combine(
        errorFormat(),
        winston.format.timestamp({ format: config.logger.timestampFormat }),
        winston.format.splat(),
        winston.format.label({ label: config.logger.label }),
        winston.format.colorize(),
        format
    ),

    transports: [
        new winston.transports.Console()
    ]
});

export default log;