import mongoose from 'mongoose'
import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import ServerError from '../errors/exception.js'
import Transaction from '../models/transaction.model.js'
import User from '../models/user.model.js'
import * as userService from './user.services.js'
import getConversionRate from '../utils/currency-convertor.js'

export const getUniqueTagsForUser = async (userId) => {
    const userExists = await userService.getUserById(userId)

    if (!userExists) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    const result = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $unwind: '$tags' },
        { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
        { $project: { _id: 0, uniqueTags: 1 } },
    ])

    return result.length > 0 ? result[0].uniqueTags : []
}

export const getCurrentBalance = async (id) => {
    // get all the transcation from the username and group them by type and subtract the sum of expenses from the sum of income
    // return the result

    const userExists = await userService.getUserById(id)

    if (!userExists) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    /* fetch all the transactions of the user, group them by type (income or expense) and subtract the 
       sum of expenses from the sum of income   from sum of the expenses */

    const result = await Transaction.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(id),
                status: 'completed',
            },
        },
        {
            $group: {
                _id: '$type',
                totalAmount: { $sum: '$amount' },
            },
        },
    ])

    // Calculate the current balance
    let income = 0
    let expense = 0

    result.forEach((group) => {
        if (group._id === 'income') {
            income = group.totalAmount
        } else if (group._id === 'expense') {
            expense = group.totalAmount
        }
    })

    return { balance: income - expense, income, expense }
}

export const create = async (props, userId) => {
    const userExists = await userService.getUserById(userId)
    if (!userExists) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    const transaction = new Transaction({
        ...props,
        user: userId,
    })

    const savedTransaction = await transaction.save()

    return savedTransaction
}

export const update = async (prop) => {
    const transaction = await Transaction.findById(prop._id)

    const tags = Array.isArray(prop.tags) ? prop.tags : []

    if (!transaction) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.transactionNotFound
        )
    }

    const updatedTags = [...new Set([...transaction.tags, ...tags])]

    const updatedTransaction = await Transaction.findByIdAndUpdate(
        prop._id,
        { ...prop, tags: updatedTags },
        { new: true }
    )

    return updatedTransaction
}

export const get = async (id) => {
    const transaction = await Transaction.findById(id)
        .populate('user', 'username email')
        .populate('category')
        .populate('goal')

    if (!transaction) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.transactionNotFound
        )
    }
    return transaction
}

export const getAll = async (id, page, limit, filters) => {
    const user = await userService.getUserById(id)
    if (!user) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    const query = { user: id, isActive: true }

    if (filters.category) {
        query.category = filters.category
    }

    if (filters.tags && filters.tags.length > 0) {
        query.tags = { $all: filters.tags }
    }

    if (filters.type) {
        query.type = filters.type
    }

    if (filters.fromDate || filters.toDate) {
        query.date = {}
        if (filters.fromDate) {
            query.date.$gte = new Date(filters.fromDate)
        }
        if (filters.toDate) {
            query.date.$lte = new Date(filters.toDate)
        }
    }

    let transactions = await Transaction.find(query)
        .populate('user category')
        .skip((page - 1) * limit)
        .limit(limit)

    const totalTransactions = await Transaction.countDocuments(query)

    const { balance, income, expense } = await getCurrentBalance(id)

    const totalPages = Math.ceil(totalTransactions / limit)
    const tags = await getUniqueTagsForUser(id)

    if (filters.currency && filters.currency !== user.defaultCurrency) {
        const conversionRate = await getConversionRate(
            user.defaultCurrency,
            filters.currency
        )
        transactions = transactions.map((transaction) => {
            return {
                ...transaction._doc,
                amount: parseFloat(
                    (transaction.amount * conversionRate).toFixed(2)
                ),
            }
        })
    }

    return {
        transactions,
        balance,
        income,
        expense,
        tags,
        page,
        limit,
        totalTransactions,
        totalPages,
    }
}

export const remove = async (id) => {
    const transaction = await Transaction.findById(id)

    if (!transaction) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.transactionNotFound
        )
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id)

    if (!deletedTransaction) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            APP_ERROR_MESSAGE.transactionDeleteFailed
        )
    }

    return deletedTransaction
}

export const getAllNonPaginated = async (id) => {
    const user = await userService.getUserById(id)
    if (!user) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.userNotFound
        )
    }

    const transactions = await Transaction.find({ user: id, isActive: true })

    return transactions
}

/* For Admins */

export const getAllUser = async (page, limit, filters) => {
    const query = {}

    if (filters && filters.userId) {
        query.user = filters.userId
    }

    if (filters && filters.fromDate) {
        query.date = {}
        query.date.$gte = new Date(filters.fromDate)
    }

    if (filters && filters.toDate) {
        if (!query.date) {
            query.date = {}
        }
        query.date.$lte = new Date(filters.toDate)
    }

    const transactions = await Transaction.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'username email defaultCurrency')

    const totalTransactions = await Transaction.countDocuments(query)
    const totalPages = Math.ceil(totalTransactions / limit)

    const transactionsWithCurrency = transactions.map((transaction) => {
        return {
            ...transaction._doc,
            currency: transaction.user.defaultCurrency,
        }
    })

    return {
        transactions: transactionsWithCurrency,
        totalTransactions,
        totalPages,
        page,
        limit,
    }
}
