import { describe, it, jest, expect } from '@jest/globals'
import * as categoryController from '../../../src/controllers/category.controller.js'
import * as categoryService from '../../../src/services/category.services.js'
import { createAPIResponse } from '../../../src/utils/request-validations.js'
import {
    APP_ERROR_MESSAGE,
    HTTP_RESPONSE_CODE,
} from '../../../src/config/constants.js'

jest.mock('../../../src/services/category.services.js')

describe('Category Controller', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createCategory', () => {
        it('should create a new category', async () => {
            const req = {
                body: { name: 'Test Category' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockCategory = { _id: 'categoryId', name: 'Test Category' }
        })

        it('should return an error if the request is invalid', async () => {
            const req = {
                body: {},
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('getCategory', () => {
        it('should return a category by id', async () => {
            const req = {
                params: { id: 'categoryId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockCategory = { _id: 'categoryId', name: 'Test Category' }
        })
    })

    describe('getAllCategories', () => {
        it('should return all categories', async () => {
            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockCategories = [
                { _id: 'categoryId', name: 'Test Category' },
            ]
        })
    })

    describe('updateCategory', () => {
        it('should update a category', async () => {
            const req = {
                params: { id: 'categoryId' },
                body: { name: 'Updated Category' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockUpdatedCategory = {
                _id: 'categoryId',
                name: 'Updated Category',
            }
        })

        it('should return an error if the request is invalid', async () => {
            const req = {
                params: { id: 'categoryId' },
                body: {},
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('deleteCategory', () => {
        it('should delete a category', async () => {
            const req = {
                params: { id: 'categoryId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockDeletedCategory = {
                _id: 'categoryId',
                name: 'Test Category',
            }
        })
    })
})
