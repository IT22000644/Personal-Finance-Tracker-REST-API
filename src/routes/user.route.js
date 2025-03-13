import { Router } from 'express'
import {
    createUser,
    authenticateUser,
    getAllUsers,
    refreshAuth,
    logOut,
    getUser,
} from '../controllers/user.controller.js'
import authenticateMiddlware from '../middleware/authenticate.middleware.js'
import authorizeMiddlware from '../middleware/authorize.middlware.js'

const userRouter = Router()

const urlPrefix = '/users/'

userRouter.post(urlPrefix, createUser)
userRouter.get(
    urlPrefix,
    authenticateMiddlware,
    authorizeMiddlware(['Admin']),
    getAllUsers
)
userRouter.get(
    `${urlPrefix}:id`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    getUser
)
userRouter.post(`${urlPrefix}auth/login`, authenticateUser)
userRouter.post(`${urlPrefix}auth/refresh`, refreshAuth)
userRouter.post(`${urlPrefix}auth/logout`, logOut)

export default userRouter
