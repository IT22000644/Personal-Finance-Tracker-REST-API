import logger from '../utils/logger.js'

const handleErrors = (error, req, res, next) => {
    const status = error.status || 500
    const message = error.message || 'Something went wrong'
    const errors = error.error || {}

    logger.error(
        `[Error Handler]: Path: ${req.path}, Method: ${req.method}, Status: ${status}, ${message}`
    )

    res.status(status).json({ status, message, error: errors })
}

export default handleErrors
