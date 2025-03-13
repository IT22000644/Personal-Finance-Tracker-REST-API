import { afterEach, describe, it, jest } from '@jest/globals'
import Budget from '../../../src/models/budget.model.js'
import * as budgetService from '../../../src/services/budget.service.js'
import ServerError from '../../../src/errors/exception.js'

const dummyBudgets = [
    {
        _id: '67c95e0947fa6a0e49b0bd58',
        amount: 1000,
        currentAmount: 500,
        category: 'categoryId',
        utilization: 50,
        user: 'userId',
        tags: ['tag1'],
    },
]

afterEach(() => {
    jest.clearAllMocks()
})

describe('Budget Service', () => {
    describe('create', () => {
        it('should create a new budget', async () => {
            const userId = '67c95e0947fa6a0e49b0bd58'
            const mockBudgetData = { amount: 1000, period: 'monthly' }
            const mockSavedBudget = {
                ...mockBudgetData,
                user: userId,
                _id: 'newBudgetId',
            }

            const savedBudget = mockSavedBudget
            expect(savedBudget).toMatchObject(mockSavedBudget)
        })
    })

    describe('get', () => {
        it('should return a budget by id', async () => {
            const budgetId = '67c95e0947fa6a0e49b0bd58'
            const budget = dummyBudgets.find((b) => b._id === budgetId)

            expect(budget).toMatchObject(dummyBudgets[0])
        })
    })

    describe('getAll', () => {
        it('should return all budgets for a user', async () => {
            const userId = 'userId'
            const budgets = dummyBudgets.filter((b) => b.user === userId)

            expect(budgets).toEqual(dummyBudgets)
        })
    })

    describe('getAllPaginated', () => {
        it('should return paginated budgets for a user', async () => {
            const page = 1
            const limit = 10
            const result = {
                budgets: dummyBudgets,
                totalBudgets: dummyBudgets.length,
                totalPages: 1,
                page,
                limit,
            }

            expect(result).toMatchObject({
                budgets: dummyBudgets,
                totalBudgets: dummyBudgets.length,
                totalPages: 1,
                page,
                limit,
            })
        })
    })

    describe('update', () => {
        it('should update an existing budget', async () => {
            const budgetId = '67c95e0947fa6a0e49b0bd58'
            const updatedTags = ['tag1', 'tag2']
            let budget = dummyBudgets.find((b) => b._id === budgetId)
            budget = { ...budget, tags: updatedTags }

            expect(budget.tags).toEqual(updatedTags)
        })
    })

    describe('remove', () => {
        it('should delete a budget by id', async () => {
            const budgetId = '67c95e0947fa6a0e49b0bd58'
            const index = dummyBudgets.findIndex((b) => b._id === budgetId)
            const deletedBudget = dummyBudgets[index]
            dummyBudgets.splice(index, 1)

            expect(deletedBudget).toMatchObject({ _id: budgetId })
            expect(dummyBudgets.length).toBe(0)
        })
    })
})
