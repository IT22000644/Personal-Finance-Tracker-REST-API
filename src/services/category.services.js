import mongoose from 'mongoose'
import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'
import ServerError from '../errors/exception.js'
import Category from '../models/category.model.js'

const checkIfCategoryExist = async (name) => {
    const categoryExists = await Category.exists({ name })

    return categoryExists
}

export const createCategory = async (prop) => {
    const { name } = prop
    const categoryExists = await checkIfCategoryExist(name)
    if (categoryExists) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.CONFLICT,
            APP_ERROR_MESSAGE.categoryExists
        )
    }

    const category = new Category(prop)

    const savedCategory = await category.save()

    return savedCategory
}

export const get = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            APP_ERROR_MESSAGE.invalidCategoryId
        )
    }

    const category = await Category.findById(id)
    if (!category) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.categoryNotFound
        )
    }
    return category
}

export const getAll = async () => {
    const categories = await Category.find()

    return categories
}

export const update = async (id, updateProps) => {
    const category = await Category.findByIdAndUpdate(id, updateProps, {
        new: true,
    })

    if (!category) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.categoryNotFound
        )
    }

    return category
}

export const remove = async (id) => {
    const category = await Category.findByIdAndDelete(id)

    if (!category) {
        throw new ServerError(
            HTTP_RESPONSE_CODE.NOT_FOUND,
            APP_ERROR_MESSAGE.categoryNotFound
        )
    }

    return category
}
