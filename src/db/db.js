import mongoose from 'mongoose'
import {
    DB_USER,
    DB_HOST,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
} from '../config/index.js'
import logger from '../utils/logger.js'

let DB_URL

if (process.env.ENV === 'local') {
    DB_URL = process.env.DB_URL
} else {
    DB_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
}

let database

const connect = () => {
    if (database) return

    mongoose
        .connect(DB_URL)
        .then((connection) => {
            database = connection
            logger.info('Database connection established')
        })
        .catch((error) => {
            logger.error(`Error connection database: ${error.message}`)
        })
}

export default connect
