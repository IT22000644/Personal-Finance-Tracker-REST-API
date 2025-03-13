import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import ServerError from '../errors/exception.js'
import Goal from '../models/goal.model.js'
import * as userService from './user.services.js'

export const create = async (userId, prop) => {
    const user = await userService.getUserById(userId)

    if (!user) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    const goal = new Goal({
        ...prop,
        tags: prop.tags || [],
        user: userId,
    })

    const newGoal = await goal.save()
    return newGoal
}

export const get = async (id) => {
    const goal = await Goal.findById(id)
        .populate('user', 'username email')
        .populate('category transactions')

    if (!goal) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.goalNotFound
        )
    }
    return goal
}

export const getAll = async (user, page, limit) => {
    const goals = await Goal.find({
        user,
    })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user category')

    return goals
}

export const getAllNonPaginated = async (user) => {
    const goals = await Goal.find({
        user,
    }).populate('user category')

    return goals
}

export const update = async (id, updates) => {
    const goal = await Goal.findByIdAndUpdate(id, updates, { new: true })
        .populate('user', 'name email')
        .populate('category', 'name')
        .populate('transactions')

    if (!goal) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.goalNotFound
        )
    }

    return goal
}

export const remove = async (id) => {
    const goal = await Goal.findByIdAndDelete(id)

    if (!goal) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.goalNotFound
        )
    }

    return goal
}
