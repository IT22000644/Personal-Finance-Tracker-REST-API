import * as categoryService from '../services/category.services.js'
import * as transactionService from '../services/transaction.service.js'
import * as budgetService from '../services/budget.service.js'
import * as goalService from '../services/goal.service.js'
import {
    createAPIResponse,
    validateTransactionCreateRequest,
    validateTransactionUpdateRequest,
} from '../utils/request-validations.js'
import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import getConversionRate from '../utils/currency-convertor.js'
import sendEmail from '../utils/sendEmail.js'
import logger from '../utils/logger.js'
// create transaction

export const createTransaction = async (req, res, next) => {
    try {
        const { currency, type, amount, tags } = req.body
        const { id } = req.params
        const reqBody = { ...req.body, type, amount, tags }

        if (req.user._id !== id) {
            return res.status(403).json({
                success: false,
                message: APP_ERROR_MESSAGE.unauthorized,
            })
        }

        const categories = await categoryService.getAll()

        const categoryIds = categories.map((category) => category._id)

        // get the current balance of all the user transactions, and subract the sum of expenses from the sum of income
        const { balance } = await transactionService.getCurrentBalance(id)

        const errors = validateTransactionCreateRequest(
            reqBody,
            categoryIds,
            balance
        )

        if (Object.keys(errors).length) {
            return res.status(400).json(errors)
        }

        if (req.body.type === 'expense' && req.body.amount > balance) {
            reqBody.status = 'pending'
        } else {
            reqBody.status = 'completed'
        }

        if (currency && req.user.defaultCurrency !== currency) {
            const conversionRate = await getConversionRate(
                currency,
                req.user.defaultCurrency
            )
            reqBody.amount *= conversionRate
            reqBody.amount = parseFloat(reqBody.amount.toFixed(2))
        }

        if (reqBody.isRecurring && new Date(reqBody.startDate) > new Date()) {
            reqBody.isActive = false
            reqBody.status = 'pending'
        }

        const newTransaction = await transactionService.create(reqBody, id)

        // need to check all the budgets and see if either category, tags or both match the transaction
        // if they do, then update the budget with the new amount
        // if no category is specified then the transaction should update that budget as well
        // only need to update budgets if they're an expense

        if (
            newTransaction.type === 'expense' &&
            newTransaction.status === 'completed'
        ) {
            const budgets =
                (await budgetService.getAll(newTransaction.user)) || []

            await Promise.all(
                budgets.map(async (budget) => {
                    const isCategoryMatch =
                        budget.category === newTransaction.category
                    const isTagMatch = budget.tags.some((tag) =>
                        newTransaction.tags.includes(tag)
                    )
                    const isUncategorized =
                        !newTransaction.category && !budget.category
                    const isUntagged =
                        !newTransaction.tags.length && !budget.tags.length

                    if (
                        isCategoryMatch ||
                        isTagMatch ||
                        isUncategorized ||
                        isUntagged
                    ) {
                        const updatedBudget = {
                            ...budget._doc,
                            currentAmount:
                                budget.currentAmount + newTransaction.amount,
                        }
                        await budgetService.update(budget._id, updatedBudget)

                        const percentage =
                            (updatedBudget.currentAmount /
                                updatedBudget.amount) *
                            100

                        if (percentage > 80) {
                            const { user, currentAmount } = updatedBudget
                            const emailContent = `
                                Dear ${user.username},
                
                                This is a notification that your budget has exceeded 80% of the target amount.
                                Your current amount is $${currentAmount}, which is ${percentage.toFixed(2)}% of your target amount of $${amount}.
                
                                Please take the necessary steps to manage your budget.
                
                                Best regards,
                                Your Company
                            `

                            await sendEmail(
                                budget.user.email,
                                'Budget Exceeded 80%',
                                emailContent
                            )
                        }
                    }
                })
            )
        } else if (newTransaction.type === 'income' && newTransaction.goal) {
            const goal = await goalService.get(newTransaction.goal)
            const updatedGoal = {
                ...goal._doc,
                currentAmount: goal.currentAmount + req.body.amount,
                transactions: [...goal.transactions, newTransaction._id],
            }
            await goalService.update(updatedGoal)
        }

        return res.status(HTTP_RESPONSE_CODE.CREATED).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.CREATED,
                APP_ERROR_MESSAGE.transactionCreated,
                newTransaction,
                {
                    type: 'POST',
                    url: 'http://localhost:6868/api/v1/transactions',
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getTransactions = async (req, res, next) => {
    try {
        const { id } = req.params

        const {
            page = 1,
            limit = 10,
            category,
            tags,
            fromDate,
            toDate,
            type,
            currency,
        } = req.query

        const filters = {
            category,
            tags: tags ? tags.split(',') : [],
            fromDate,
            toDate,
            type,
            currency,
        }

        if (req.user._id !== id) {
            return res.status(403).json({
                success: false,
                message: APP_ERROR_MESSAGE.unauthorized,
            })
        }

        const transactions = await transactionService.getAll(
            id,
            page,
            limit,
            filters
        )

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.transactionsFetched,
                transactions,
                {
                    type: 'GET',
                    url: 'http://localhost:6868/api/v1/transactions/{userId}?page=1&limit=10',
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getTransactionById = async (req, res, next) => {
    try {
        const { id, transactionId } = req.params

        if (req.user._id !== id) {
            return res.status(403).json({
                success: false,
                message: APP_ERROR_MESSAGE.unauthorized,
            })
        }

        const transaction = await transactionService.get(transactionId)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.transactionFound,
                transaction,
                {
                    type: 'GET',
                    url: 'http://localhost:6868/api/v1/transactions/{userId}/{transactionId}',
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateTransaction = async (req, res, next) => {
    try {
        const { id, transactionId } = req.params

        if (req.user._id !== id) {
            return res.status(403).json({
                success: false,
                message: APP_ERROR_MESSAGE.unauthorized,
            })
        }

        const categories = await categoryService.getAll()

        const categoryIds = categories.map((category) => category._id)

        if (req.user._id !== id) {
            return res.status(403).json({
                success: false,
                message: APP_ERROR_MESSAGE.unauthorized,
            })
        }

        const error = validateTransactionUpdateRequest(req, categories)
        if (Object.keys(error).length) {
            return res.status(400).json({
                success: false,
                error,
            })
        }

        const updatedTransaction = await transactionService.update({
            _id: transactionId,
            ...req.body,
        })

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.transactionUpdated,
                updatedTransaction,
                {
                    type: 'PUT',
                    url: 'http://localhost:6868/api/v1/transactions/{userId}/{transactionId}',
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteTransaction = async (req, res, next) => {
    try {
        const { id, transactionId } = req.params

        if (req.user._id !== id) {
            return res.status(403).json({
                success: false,
                message: APP_ERROR_MESSAGE.unauthorized,
            })
        }

        const removedTransaction =
            await transactionService.remove(transactionId)

        // update budgets associated with this transaction
        if (removedTransaction.type === 'expense') {
            const budgets =
                (await budgetService.getAll(removedTransaction.user)) || []
            await Promise.all(
                budgets.map(async (budget) => {
                    const isCategoryMatch =
                        budget.category === removedTransaction.category
                    const isTagMatch = budget.tags.some((tag) =>
                        removedTransaction.tags.includes(tag)
                    )
                    const isUncategorized =
                        !removedTransaction.category && !budget.category
                    const isUntagged =
                        !removedTransaction.tags.length && !budget.tags.length

                    if (
                        isCategoryMatch ||
                        isTagMatch ||
                        isUncategorized ||
                        isUntagged
                    ) {
                        const updatedBudget = {
                            ...budget,
                            amount: budget.amount - removedTransaction.amount,
                        }
                        await budgetService.update(updatedBudget)
                    }
                })
            )
        } else if (
            removedTransaction.type === 'income' &&
            removedTransaction.goal
        ) {
            const goal = await goalService.get(removedTransaction.goal)
            const updatedGoal = {
                ...goal,
                currentAmount: goal.currentAmount - removedTransaction.amount,
                transactions: goal.transactions.filter(
                    (transaction) => transaction !== removedTransaction._id
                ),
            }
            await goalService.update(updatedGoal)
        }

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.transactionDeleted,
                removedTransaction,
                {
                    type: 'DELETE',
                    url: 'http://localhost:6868/api/v1/transactions/{userId}/{transactionId}',
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

/* For Admin */
export const getAllUserTransactions = async (req, res, next) => {
    try {
        // parse filters
        const {
            page = 1,
            limit = 10,
            category,
            tags,
            fromDate,
            toDate,
            type,
            currency,
        } = req.query

        const transactions = await transactionService.getAllUser(page, limit, {
            category,
            tags: tags ? tags.split(',') : [],
            fromDate,
            toDate,
            type,
        })

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.transactionsFetched,
                transactions,
                {
                    type: 'GET',
                    url: 'http://localhost:6868/api/v1/transactions/{userId}?page=1&limit=10',
                }
            )
        )
    } catch (error) {
        next(error)
    }
}
