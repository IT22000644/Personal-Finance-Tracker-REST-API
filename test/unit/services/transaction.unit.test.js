import { afterEach, describe, it, jest } from '@jest/globals'
import mockingoose from 'mockingoose'
import Transaction from '../../../src/models/transaction.model.js'
import * as transactionService from '../../../src/services/transaction.service.js'
import * as userService from '../../../src/services/user.services.js'
import ServerError from '../../../src/errors/exception.js'

jest.mock('../../../src/services/user.services.js', () => ({
    getUserById: jest.fn(),
}))

afterEach(() => {
    jest.restoreAllMocks()
})

describe('Transaction Service', () => {
    afterEach(() => {
        jest.clearAllMocks()
        mockingoose.resetAll()
    })

    describe('create', () => {
        it('should create a new transaction', async () => {
            const userId = '67c95e0947fa6a0e49b0bd58'
            const mockUser = { _id: userId }
            const mockTransactionData = { amount: 100, type: 'income' }
            const mockSavedTransaction = {
                ...mockTransactionData,
                user: userId,
            }

            userService.getUserById(mockUser)

            expect(mockSavedTransaction).toMatchObject(mockSavedTransaction)
        })

        it('should throw an error if user does not exist', async () => {
            const userId = '67c95e0947fa6a0e49b0bd58'
            const mockTransactionData = { amount: 100, type: 'income' }

            userService.getUserById(null)

            await expect(
                transactionService.create(mockTransactionData, userId)
            ).rejects.toThrow(ServerError)
        })
    })

    describe('update', () => {
        it('should throw an error if transaction does not exist', async () => {
            const transactionId = '67c95e0947fa6a0e49b0bd58'

            mockingoose(Transaction).toReturn(null, 'findById')

            await expect(
                transactionService.update({
                    _id: transactionId,
                    tags: ['tag2'],
                })
            ).rejects.toThrow(ServerError)
        })
    })

    describe('get', () => {
        it('should throw an error if transaction does not exist', async () => {
            const transactionId = '67c95e0947fa6a0e49b0bd58'

            mockingoose(Transaction).toReturn(null, 'findById')

            await expect(transactionService.get(transactionId)).rejects.toThrow(
                ServerError
            )
        })
    })

    describe('getAll', () => {
        it('should throw an error if user does not exist', async () => {
            const userId = '67c95e0947fa6a0e49b0bd58'

            userService.getUserById(null)

            await expect(
                transactionService.getAll(userId, 1, 10, {})
            ).rejects.toThrow(ServerError)
        })
    })

    describe('remove', () => {
        it('should throw an error if transaction does not exist', async () => {
            const transactionId = '67c95e0947fa6a0e49b0bd58'

            mockingoose(Transaction).toReturn(null, 'findById')

            await expect(
                transactionService.remove(transactionId)
            ).rejects.toThrow(ServerError)
        })
    })
})
