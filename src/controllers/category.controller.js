import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import {
    createAPIResponse,
    validateCategoryRequest,
} from '../utils/request-validations.js'

import * as categoryService from '../services/category.services.js'

export const createCategory = async (req, res, next) => {
    try {
        const reqBody = req.body

        const error = validateCategoryRequest(reqBody)

        if (Object.keys(error).length) {
            return res
                .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
                .json({ error: 'Error in the request' })
        }

        const category = await categoryService.createCategory(reqBody)

        return res.status(HTTP_RESPONSE_CODE.CREATED).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.CREATED,
                APP_ERROR_MESSAGE.categoryCreated,
                category,
                {
                    type: 'POST',
                    url: 'http://localhost:8686/api/vi/category',
                }
            )
        )
    } catch (err) {
        next(err)
    }
}

export const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await categoryService.get(id)
        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.categoryFound,
                category,
                {
                    type: 'GET',
                    url: 'http://localhost:8686/api/vi/category',
                }
            )
        )
    } catch (err) {
        next(err)
    }
}

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAll()
        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.categoryFound,
                categories,
                {
                    type: 'GET',
                    url: 'http://localhost:8686/api/vi/category',
                }
            )
        )
    } catch (err) {
        next(err)
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const reqBody = req.body

        const error = validateCategoryRequest(reqBody)

        if (Object.keys(error).length) {
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ error })
        }

        const category = await categoryService.update(id, reqBody)

        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.categoryUpdated,
                category,
                {
                    type: 'PUT',
                    url: 'http://localhost:8686/api/vi/category',
                }
            )
        )
    } catch (err) {
        next(err)
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await categoryService.remove(id)
        return res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            createAPIResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                APP_ERROR_MESSAGE.categoryDeleted,
                category,
                {
                    type: 'DELETE',
                    url: 'http://localhost:8686/api/vi/category',
                }
            )
        )
    } catch (err) {
        next(err)
    }
}
