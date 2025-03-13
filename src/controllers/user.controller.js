import {
    createAPIResponse,
    validateUserUpdateRequest,
    validUserRequest,
} from '../utils/request-validations.js'
import {
    create,
    authenticate,
    getUsers,
    update,
    refresh,
    getUserById,
} from '../services/user.services.js'

import { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE } from '../config/constants.js'

export const createUser = async (req, res, next) => {
    try {
        const reqBody = req.body
        const error = validUserRequest(reqBody)

        if (Object.keys(error).length) {
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ error })
        }

        const user = await create(reqBody)
        const userToJson = user.toJSON()
        const { password, ...reponse } = userToJson

        return res
            .status(HTTP_RESPONSE_CODE.CREATED)
            .json(
                createAPIResponse(
                    true,
                    HTTP_RESPONSE_CODE.CREATED,
                    APP_ERROR_MESSAGE.createdUser,
                    reponse,
                    { type: 'POST', url: 'http://localhost:8080/users' }
                )
            )
    } catch (err) {
        next(err)
    }
}

export const authenticateUser = async (req, res, next) => {
    try {
        const reqBody = req.body
        const authenticatedUser = await authenticate(reqBody)
        const { password, refreshToken, ...response } = authenticatedUser
        return res
            .status(HTTP_RESPONSE_CODE.SUCCESS)
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
            })
            .json(
                createAPIResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    APP_ERROR_MESSAGE.userAuthenticated,
                    response,
                    {
                        type: 'POST',
                        url: 'http://localhost:8080/users/auth/login',
                    }
                )
            )
    } catch (err) {
        next(err)
    }
}

export const logOut = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies

        if (!refreshToken) {
            return res
                .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
                .json({ error: 'No Auth Cookie found' })
        }

        return res
            .status(HTTP_RESPONSE_CODE.SUCCESS)
            .cookie('refreshToken', '', {
                httpOnly: true,
                sameSite: 'strict',
                expiresIn: new Date(1),
            })
            .json(
                createAPIResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    APP_ERROR_MESSAGE.logOutSucces,
                    {
                        type: 'POST',
                        url: 'http://localhost:8080/users/auth/logout',
                    }
                )
            )
    } catch (err) {
        next(err)
    }
}

export const refreshAuth = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies

        if (!refreshToken) {
            return res
                .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
                .json({ error: 'No Auth Cookie found' })
        }

        const accessToken = await refresh(refreshToken)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.userAuthenticated,
                accessToken,
                {
                    type: 'POST',
                    url: 'http://localhost:8080/users/auth/refresh',
                }
            )
        )
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await getUserById(id)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(true, APP_ERROR_MESSAGE.userReturned, user, {
                type: 'GET',
                url: 'http://localhost:6868.api/vi/users/:id',
            })
        )
    } catch (err) {
        next(err)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 10

        const users = await getUsers(page, limit)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(true, APP_ERROR_MESSAGE.usersReturned, users, {
                type: 'GET',
                url: 'http://localhost:6868/api/v1/users?page={pageNo}&limit={pageLimit}',
            })
        )
    } catch (err) {
        next(err)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const reqBody = req.body
        const error = validateUserUpdateRequest(reqBody)

        if (Object.keys(error).length) {
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ error })
        }

        const updatedUser = await update(id, reqBody)
        const userToJson = updateUser.toJSON()
        const { password, ...reponse } = userToJson

        return res
            .status(HTTP_RESPONSE_CODE.CREATED)
            .json(
                createAPIResponse(
                    true,
                    HTTP_RESPONSE_CODE.CREATED,
                    APP_ERROR_MESSAGE.updatedUser,
                    reponse,
                    { type: 'POST', url: 'http://localhost:8080/users' }
                )
            )
    } catch (err) {
        next(err)
    }
}
