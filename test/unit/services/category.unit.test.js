import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { afterEach, describe, jest } from '@jest/globals'
import mockingoose from 'mockingoose'
import Category from '../../../src/models/category.model.js'
import * as categoryService from '../../../src/services/category.services.js'
import ServerError from '../../../src/errors/exception.js'
import {
    HTTP_RESPONSE_CODE,
    APP_ERROR_MESSAGE,
} from '../../../src/config/constants.js'

describe('Category Service', () => {
    afterEach(() => {
        jest.clearAllMocks() // Clear mocks after each test
        mockingoose.resetAll() // Reset all mockingoose mocks after each test
    })

    describe('createCategory', () => {
        it('should create a new category when category does not exist', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
            }

            mockingoose(Category).toReturn(null, 'findOne')

            const findOneSpy = jest.spyOn(Category, 'findOne')

            mockingoose(Category).toReturn(mockCategoryData, 'save')

            const createdCategory =
                await categoryService.createCategory(mockCategoryData)

            createdCategory._doc._id = createdCategory._doc._id.toString()

            expect(findOneSpy).toHaveBeenCalledWith({
                name: mockCategoryData.name,
            })
            expect(createdCategory._doc).toMatchObject({
                _id: mockCategoryData._id,
                name: mockCategoryData.name,
            })
        })

        it('should throw an error when category already exists', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
            }

            mockingoose(Category).toReturn(mockCategoryData, 'findOne')

            const findOneSpy = jest.spyOn(Category, 'findOne')

            try {
                await categoryService.createCategory(mockCategoryData)
            } catch (error) {
                expect(findOneSpy).toHaveBeenCalledWith({
                    name: mockCategoryData.name,
                })

                expect(error).toBeInstanceOf(ServerError)
            }
        })
    })

    describe('getCategory', () => {
        it('should return category when category exists', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
            }

            mockingoose(Category).toReturn(mockCategoryData, 'findOne')

            const findOneSpy = jest.spyOn(Category, 'findOne')

            const category = await categoryService.get(mockCategoryData._id)

            category._doc._id = category._doc._id.toString()

            expect(category._doc).toMatchObject(mockCategoryData)
        })

        it('should throw an error when category does not exist', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
            }

            mockingoose(Category).toReturn(null, 'findOne')

            const findOneSpy = jest.spyOn(Category, 'findOne')

            try {
                await categoryService.get(mockCategoryData._id)
            } catch (error) {
                expect(error).toBeInstanceOf(ServerError)
            }
        })
    })

    describe('updateCategory', () => {
        it('should update category when category exists', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
            }

            mockingoose(Category).toReturn(mockCategoryData, 'findOneAndUpdate')

            const findOneAndUpdateSpy = jest.spyOn(Category, 'findOneAndUpdate')

            const updatedCategory = await categoryService.update(
                mockCategoryData._id,
                mockCategoryData
            )

            updatedCategory._doc._id = updatedCategory._doc._id.toString()

            expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
                {
                    _id: mockCategoryData._id,
                },
                mockCategoryData,
                {
                    new: true,
                }
            )

            expect(updatedCategory).toMatchObject(mockCategoryData)
        })

        it('should throw an error when category does not exist', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
            }

            mockingoose(Category).toReturn(null, 'findOneAndUpdate')

            const findOneAndUpdateSpy = jest.spyOn(Category, 'findOneAndUpdate')

            try {
                await categoryService.update(
                    mockCategoryData._id,
                    mockCategoryData
                )
            } catch (error) {
                expect(error).toBeInstanceOf(ServerError)
            }
        })
    })

    describe('deleteCategory', () => {
        it('should delete category when category exists', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
            }

            mockingoose(Category).toReturn(mockCategoryData, 'findOneAndDelete')

            const findOneAndDeleteSpy = jest.spyOn(Category, 'findOneAndDelete')

            const deletedCategory = await categoryService.remove(
                mockCategoryData._id
            )

            deletedCategory._doc._id = deletedCategory._doc._id.toString()

            expect(deletedCategory).toMatchObject(mockCategoryData)
        })

        it('should throw an error when category does not exist', async () => {
            const mockCategoryData = {
                _id: '67c95e0947fa6a0e49b0bd58',
                name: 'Electronics',
                description: 'All electronics items',
                createdOn: new Date('2025-03-06T08:34:17.156Z'),
            }

            mockingoose(Category).toReturn(null, 'findOneAndDelete')

            const findOneAndDeleteSpy = jest.spyOn(Category, 'findOneAndDelete')

            try {
                await categoryService.remove(mockCategoryData._id)
            } catch (error) {
                expect(error).toBeInstanceOf(ServerError)
            }
        })
    })
})
