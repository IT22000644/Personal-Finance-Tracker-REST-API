import { describe, it, jest, expect } from '@jest/globals'
import * as transactionController from '../../../src/controllers/transaction.controller.js'
import * as categoryService from '../../../src/services/category.services.js'
import * as transactionService from '../../../src/services/transaction.service.js'
import * as budgetService from '../../../src/services/budget.service.js'
import * as goalService from '../../../src/services/goal.service.js'
import { createAPIResponse } from '../../../src/utils/request-validations.js'
import {
    APP_ERROR_MESSAGE,
    HTTP_RESPONSE_CODE,
} from '../../../src/config/constants.js'

jest.mock('../../../src/services/category.services.js')
jest.mock('../../../src/services/transaction.service.js')
jest.mock('../../../src/services/budget.service.js')
jest.mock('../../../src/services/goal.service.js')
jest.mock('../../../src/utils/currency-convertor.js')
jest.mock('../../../src/utils/sendEmail.js')

describe('Transaction Controller', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createTransaction', () => {
        it('should create a new transaction', async () => {
            const req = {
                body: {
                    currency: 'USD',
                    type: 'expense',
                    amount: 100,
                    tags: [],
                },
                params: { id: 'userId' },
                user: { _id: 'userId', defaultCurrency: 'USD' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockCategories = [{ _id: 'categoryId' }]
            const mockBalance = { balance: 1000 }
            const mockTransaction = {
                _id: 'transactionId',
                type: 'expense',
                amount: 100,
                user: 'userId',
                status: 'completed',
            }
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                body: {
                    currency: 'USD',
                    type: 'expense',
                    amount: 100,
                    tags: [],
                },
                params: { id: 'userId' },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('getTransactions', () => {
        it('should return all transactions for a user', async () => {
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
            const mockTransactions = [
                {
                    _id: 'transactionId',
                    type: 'expense',
                    amount: 100,
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

    describe('getTransactionById', () => {
        it('should return a transaction by id', async () => {
            const req = {
                params: { id: 'userId', transactionId: 'transactionId' },
                user: { _id: 'userId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockTransaction = {
                _id: 'transactionId',
                type: 'expense',
                amount: 100,
                user: 'userId',
            }
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                params: { id: 'userId', transactionId: 'transactionId' },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('updateTransaction', () => {
        it('should update a transaction', async () => {
            const req = {
                params: { id: 'userId', transactionId: 'transactionId' },
                body: { amount: 200 },
                user: { _id: 'userId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockUpdatedTransaction = {
                _id: 'transactionId',
                type: 'expense',
                amount: 200,
                user: 'userId',
            }
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                params: { id: 'userId', transactionId: 'transactionId' },
                body: { amount: 200 },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('deleteTransaction', () => {
        it('should delete a transaction', async () => {
            const req = {
                params: { id: 'userId', transactionId: 'transactionId' },
                user: { _id: 'userId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockRemovedTransaction = {
                _id: 'transactionId',
                type: 'expense',
                amount: 100,
                user: 'userId',
            }
        })

        it('should return an error if the user is unauthorized', async () => {
            const req = {
                params: { id: 'userId', transactionId: 'transactionId' },
                user: { _id: 'differentUserId' },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
        })
    })

    describe('getAllUserTransactions', () => {
        it('should return all user transactions for admin', async () => {
            const req = {
                query: { page: 1, limit: 10 },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockTransactions = [
                {
                    _id: 'transactionId',
                    type: 'expense',
                    amount: 100,
                    user: 'userId',
                },
            ]
        })
    })
})
