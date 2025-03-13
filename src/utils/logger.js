import path, { join } from 'path'
import { fileURLToPath } from 'url'
import winston from 'winston'
import { LOG_DIR } from '../config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { combine, colorize, timestamp, align, printf } = winston.format

const dir = join(__dirname, LOG_DIR)

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const format = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    colorize({ all: true }),
    printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
)

const custformat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}`
    )
)

const transports = [
    new winston.transports.Console({
        format,
    }),
    new winston.transports.File({
        dirname: dir,
        filename: 'error.log',
        level: 'error',
        format: custformat,
    }),
    new winston.transports.File({
        dirname: dir,
        format: custformat,
        filename: 'all.log',
    }),
    new winston.transports.File({
        dirname: dir,
        filename: 'http.log',
        level: 'http',
        format: custformat,
    }),
]

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    transports,
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exception.log' }),
    ],
})

export default logger
