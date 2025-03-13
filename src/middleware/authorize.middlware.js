import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import ServerError from '../errors/exception.js'

const authorizeMiddlware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ServerError(
                HTTP_RESPONSE_CODE.UNAUTHORIZED,
                APP_ERROR_MESSAGE.actionNotAllowed
            )
        }
        next()
    }
}

export default authorizeMiddlware
