import { describe, it, jest, expect } from '@jest/globals'
import * as budgetController from '../../../src/controllers/budget.controller.js'
import * as budgetService from '../../../src/services/budget.service.js'
import { createAPIResponse } from '../../../src/utils/request-validations.js'
import {
    APP_ERROR_MESSAGE,
    HTTP_RESPONSE_CODE,
} from '../../../src/config/constants.js'

jest.mock('../../../src/services/budget.service.js')

describe('Budget Controller', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createBudget', () => {
        it('should create a new budget', async () => {
            const req = {
                params: { id: 'userId' },
                body: { amount: 1000, period: 'monthly' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockBudget = {
                _id: 'budgetId',
                amount: 1000,
                period: 'monthly',
                user: 'userId',
            }
        })

        it('should return an error if the request is invalid', async () => {
            const req = {
                params: { id: 'userId' },
                body: {},
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('getBudgets', () => {
        it('should return all budgets for a user', async () => {
            const req = {
                params: { id: 'userId' },
                query: { page: 1, limit: 10 },
                user: { _id: 'userId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockBudgets = [
                {
                    _id: 'budgetId',
                    amount: 1000,
                    period: 'monthly',
                    user: 'userId',
                },
            ]
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                params: { id: 'userId' },
                query: { page: 1, limit: 10 },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('getBudget', () => {
        it('should return a budget by id', async () => {
            const req = {
                params: { id: 'userId', budgetId: 'budgetId' },
                user: { _id: 'userId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockBudget = {
                _id: 'budgetId',
                amount: 1000,
                period: 'monthly',
                user: 'userId',
            }
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                params: { id: 'userId', budgetId: 'budgetId' },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('updateBudget', () => {
        it('should update a budget', async () => {
            const req = {
                params: { id: 'userId', budgetId: 'budgetId' },
                body: { amount: 2000 },
                user: { _id: 'userId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockUpdatedBudget = {
                _id: 'budgetId',
                amount: 2000,
                period: 'monthly',
                user: 'userId',
            }
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                params: { id: 'userId', budgetId: 'budgetId' },
                body: { amount: 2000 },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('removeBudget', () => {
        it('should delete a budget', async () => {
            const req = {
                params: { id: 'userId', budgetId: 'budgetId' },
                user: { _id: 'userId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockRemovedBudget = {
                _id: 'budgetId',
                amount: 1000,
                period: 'monthly',
                user: 'userId',
            }
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                params: { id: 'userId', budgetId: 'budgetId' },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })
})
