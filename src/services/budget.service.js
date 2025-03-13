import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import ServerError from '../errors/exception.js'
import Budget from '../models/budget.model.js'
import * as userService from './user.services.js'

export const create = async (prop, userId) => {
    const user = await userService.getUserById(userId)

    if (!user) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    const budget = new Budget({
        ...prop,
        tags: prop.tags || [],
        user: userId,
        endDate:
            prop.period === 'weekly'
                ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })

    const newBudget = await budget.save()

    return newBudget
}

export const get = async (id) => {
    let budget = await Budget.findById(id).populate('category')

    // display the utilization as a percentage
    budget = {
        utilization: (budget.currentAmount / budget.amount) * 100,
        ...budget._doc,
    }

    return budget
}

export const getAll = async (id) => {
    const budgets = await Budget.find({ user: id }).populate(
        'user',
        'username email'
    )

    return budgets
}

export const getAllPaginated = async (id, page, limit) => {
    const budgets = await Budget.find({ user: id })
        .skip((page - 1) * limit)
        .limit(limit)

    const totalBudgets = await Budget.countDocuments({ user: id })
    const totalPages = Math.ceil(totalBudgets / limit)

    return { budgets, totalBudgets, totalPages, page, limit }
}

export const update = async (id, body) => {
    const updatedBudget = await Budget.findByIdAndUpdate(id, body, {
        new: true,
    })

    return updatedBudget
}

export const remove = async (id) => {
    const deletedBudget = await Budget.findByIdAndDelete(id)

    return deletedBudget
}
