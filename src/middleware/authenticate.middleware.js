import jwt from 'jsonwebtoken'
import ServerError from '../errors/exception.js'

import { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE } from '../config/constants.js'
import { AUTH_ACCESS_TOKEN_SECRET } from '../config/index.js'

const authenticateMiddlware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization')
        if (!authHeader?.startsWith('Bearer')) {
            throw new ServerError(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                APP_ERROR_MESSAGE.authheadermissing
            )
        }

        const accessToken = authHeader.split(' ')[1]

        const decoded = jwt.verify(accessToken, AUTH_ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            err.status = HTTP_RESPONSE_CODE.UNAUTHORIZED
            err.message = APP_ERROR_MESSAGE.tokenExpired
        }
        next(err)
    }
}

export default authenticateMiddlware
