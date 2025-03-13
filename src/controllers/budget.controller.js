import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import * as budgetService from '../services/budget.service.js'
import {
    createAPIResponse,
    validateBudgetRequest,
} from '../utils/request-validations.js'

export const createBudget = async (req, res, next) => {
    try {
        const { id } = req.params

        const reqBody = req.body

        const error = validateBudgetRequest(reqBody)

        if (Object.keys(error).length > 0) {
            return res.status(400).json({ success: false, errors: error })
        }

        const newBudget = await budgetService.create(reqBody, id)

        return res.status(HTTP_RESPONSE_CODE.CREATED).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.CREATED,
                APP_ERROR_MESSAGE.budgetCreated,
                newBudget,
                {
                    type: 'POST',
                    url: `http://localhost:8686/api/v1/budget/${id}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getBudgets = async (req, res, next) => {
    try {
        const { id } = req.params

        const { page = 1, limit = 10 } = req.query

        if (req.user._id !== id) {
            return res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(
                    createAPIResponse(
                        false,
                        HTTP_RESPONSE_CODE.FORBIDDEN,
                        APP_ERROR_MESSAGE.unauthorizedAccess
                    )
                )
        }

        const budgets = await budgetService.getAllPaginated(id, page, limit)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.budgetsRetrieved,
                budgets,
                {
                    type: 'GET',
                    url: `http://localhost:8686/api/v1/budget/${id}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getBudget = async (req, res, next) => {
    try {
        const { id, budgetId } = req.params
        const budget = await budgetService.get(budgetId)

        if (id !== req.user._id) {
            return res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(
                    createAPIResponse(
                        false,
                        HTTP_RESPONSE_CODE.FORBIDDEN,
                        APP_ERROR_MESSAGE.unauthorizedAccess
                    )
                )
        }

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.OK,
                APP_ERROR_MESSAGE.budgetFound,
                budget,
                {
                    type: 'GET',
                    url: `http://localhost:8686/api/v1/budget/${id}/${budgetId}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateBudget = async (req, res, next) => {
    try {
        const { id, budgetId } = req.params

        const reqBody = req.body

        if (id !== req.user._id) {
            return res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(
                    createAPIResponse(
                        false,
                        HTTP_RESPONSE_CODE.FORBIDDEN,
                        APP_ERROR_MESSAGE.unauthorizedAccess
                    )
                )
        }

        // const error = validateBudgetRequest(reqBody)

        // if (Object.keys(error).length > 0) {
        //     return res.status(400).json({ success: false, errors: error })
        // }

        const updatedBudget = await budgetService.update(budgetId, reqBody)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.budgetUpdated,
                updatedBudget,
                {
                    type: 'PUT',
                    url: `http://localhost:8686/api/v1/budget/${id}/${budgetId}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const removeBudget = async (req, res, next) => {
    try {
        const { id, budgetId } = req.params

        if (id !== req.user._id) {
            return res
                .status(HTTP_RESPONSE_CODE.FORBIDDEN)
                .json(
                    createAPIResponse(
                        false,
                        HTTP_RESPONSE_CODE.FORBIDDEN,
                        APP_ERROR_MESSAGE.unauthorizedAccess
                    )
                )
        }

        const removedBudget = await budgetService.remove(budgetId)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.budgetRemoved,
                removedBudget,
                {
                    type: 'DELETE',
                    url: `http://localhost:8686/api/v1/budget/${id}/${budgetId}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}
