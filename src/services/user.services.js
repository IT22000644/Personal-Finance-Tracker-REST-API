import brcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import ServerError from '../errors/exception.js'

import { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE } from '../config/constants.js'
import {
    AUTH_ACCESS_TOKEN_SECRET,
    AUTH_ACCESS_TOKEN_EXPIRY,
    AUTH_REFRESH_TOKEN_SECRET,
    AUTH_REFRESH_TOKEN_EXPIRY,
} from '../config/index.js'
import { isEmail } from '../utils/request-validations.js'

export const checkIfUserExists = async (email) => {
    const user = await User.findOne({ email })
    return !!user
}

export const create = async (prop) => {
    const {
        username,
        firstname,
        lastname,
        email,
        dob,
        password,
        role,
        country,
        defaultCurrency,
    } = prop

    const userExists = await checkIfUserExists(email)
    if (userExists) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userAlreadyExist
        )
    }

    const salt = await brcrypt.genSalt()
    const hashedPassword = await brcrypt.hash(password, salt)

    const user = new User({
        username,
        firstname,
        lastname,
        email,
        dob,
        password: hashedPassword,
        role,
        country,
        defaultCurrency,
    })

    const createdUser = await user.save()

    return createdUser
}

export const authenticate = async (prop) => {
    const { email, password } = prop

    const validEmail = isEmail(email)

    if (!validEmail) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.invalidEmail
        )
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.invalidCredentials
        )
    }

    const validatePassword = await brcrypt.compare(password, user.password)
    if (!validatePassword) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.invalidCredentials
        )
    }

    await User.findOneAndUpdate(
        { _id: user._id },
        {
            lastLogin: new Date(),
        }
    )

    const tokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET
    const accessToken = jwt.sign(
        {
            _id: user._id,
            role: user.role,
            email: user.email,
            username: user.username,
            defaultCurrency: user.defaultCurrency,
        },
        tokenSecret,
        {
            expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
        }
    )

    const refreshToken = jwt.sign(
        {
            _id: user._id,
            role: user.role,
            email: user.email,
            username: user.username,
            defaultCurrency: user.defaultCurrency,
        },
        AUTH_REFRESH_TOKEN_SECRET,
        {
            expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
        }
    )

    return { ...user.toJSON(), accessToken, refreshToken }
}

export const getUsers = async (page, limit) => {
    const users = await User.find()
        .select('-password')
        .skip((page - 1) * limit)
        .limit(limit)
        .exec()

    const totalUsers = await User.countDocuments()

    return {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        users,
    }
}

export const getUserById = async (id) => {
    const user = await User.findById(id)

    return user
}

export const update = async (id, updates) => {
    const user = await User.findByIdAndUpdate(id, updates)

    return user
}

export const refresh = async (refreshToken) => {
    const decode = jwt.verify(
        refreshToken,
        process.env.AUTH_REFRESH_TOKEN_SECRET
    )

    const { _id } = decode

    const user = await User.findById(_id)

    if (!user) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    const tokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET
    const newToken = jwt.sign(
        {
            _id: user._id,
            role: user.role,
            email: user.email,
            username: user.username,
            defaultCurrency: user.defaultCurrency,
        },
        tokenSecret,
        {
            expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
        }
    )

    return newToken
}
