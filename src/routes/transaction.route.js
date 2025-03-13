import { Router } from 'express'
import * as transactionController from '../controllers/transaction.controller.js'
import authenticateMiddlware from '../middleware/authenticate.middleware.js'
import authorizeMiddlware from '../middleware/authorize.middlware.js'

const transactionRouter = new Router()

const urlPrefix = '/transaction'

transactionRouter.get(
    `${urlPrefix}/`,
    authenticateMiddlware,
    authorizeMiddlware(['Admin']),
    transactionController.getAllUserTransactions
)

transactionRouter.post(
    `${urlPrefix}/:id/`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    transactionController.createTransaction
)

transactionRouter.get(
    `${urlPrefix}/:id/`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    transactionController.getTransactions
)

transactionRouter.get(
    `${urlPrefix}/:id/:transactionId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    transactionController.getTransactionById
)

transactionRouter.put(
    `${urlPrefix}/:id/:transactionId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    transactionController.updateTransaction
)

transactionRouter.delete(
    `${urlPrefix}/:id/:transactionId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    transactionController.deleteTransaction
)

export default transactionRouter
