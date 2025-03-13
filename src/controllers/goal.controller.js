import * as goalService from '../services/goal.service.js'
import * as categoryService from '../services/category.services.js'
import {
    createAPIResponse,
    validateGoalRequest,
} from '../utils/request-validations.js'
import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'

export const createGoal = async (req, res, next) => {
    try {
        const { id } = req.params

        const categories = await categoryService.getAll()

        const categoryIds = categories.map((category) => category._id)

        const error = validateGoalRequest(req.body, categoryIds)

        if (Object.keys(error).length > 0) {
            return res.status(400).json({ success: false, errors: error })
        }

        const goal = await goalService.create(id, req.body)

        return res.status(HTTP_RESPONSE_CODE.CREATED).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.CREATED,
                APP_ERROR_MESSAGE.goalCreated,
                goal,
                {
                    type: 'POST',
                    url: `http://localhost:8686/api/v1/goal/{userId}/`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const getGoal = async (req, res, next) => {
    try {
        const { id, goalId } = req.params

        const goal = await goalService.get(goalId)

        if (goal.user._id.toString() !== id) {
            return res
                .status(HTTP_RESPONSE_CODE.UNAUTHORIZED)
                .json(
                    createAPIResponse(
                        false,
                        HTTP_RESPONSE_CODE.UNAUTHORIZED,
                        APP_ERROR_MESSAGE.unauthorizedAccess
                    )
                )
        }

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.goalFound,
                goal,
                {
                    type: 'GET',
                    url: `http://localhost:8686/api/v1/goal/${id}/${goalId}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const updateGoal = async (req, res, next) => {
    try {
        const { id, goalId } = req.params

        const reqBody = req.body

        const updatedGoal = await goalService.update(goalId, reqBody)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.goalUpdated,
                updatedGoal,
                {
                    type: 'PUT',
                    url: `http://localhost:8686/api/v1/goal/${id}/${goalId}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}

export const deleteGoal = async (req, res, next) => {
    try {
        const { id, goalId } = req.params

        const goal = await goalService.remove(goalId)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.goalDeleted,
                goal,
                {
                    type: 'DELETE',
                    url: `http://localhost:8686/api/v1/goal/${id}/${goalId}`,
                }
            )
        )
    } catch (error) {
        next(error)
    }
}
