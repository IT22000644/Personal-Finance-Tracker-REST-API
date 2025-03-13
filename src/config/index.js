import { config } from 'dotenv'

config()

export const {
    LOG_FORMAT,
    LOG_DIR,
    DB_HOST,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    DB_USER,
    AUTH_REFRESH_TOKEN_SECRET,
    AUTH_REFRESH_TOKEN_EXPIRY,
    AUTH_ACCESS_TOKEN_SECRET,
    AUTH_ACCESS_TOKEN_EXPIRY,
    CURRENCY_API_KEY,
    EMAIL_USER,
    EMAIL_PASS,
} = process.env
