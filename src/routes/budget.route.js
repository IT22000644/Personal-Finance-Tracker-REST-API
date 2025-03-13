import { Router } from 'express'
import authenticateMiddlware from '../middleware/authenticate.middleware.js'
import * as budgetController from '../controllers/budget.controller.js'
import authorizeMiddlware from '../middleware/authorize.middlware.js'

const budgetRouter = new Router()

const urlPrefix = '/budget'

budgetRouter.post(
    `${urlPrefix}/:id/`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    budgetController.createBudget
)

budgetRouter.get(
    `${urlPrefix}/:id/:budgetId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    budgetController.getBudget
)

budgetRouter.get(
    `${urlPrefix}/:id/`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    budgetController.getBudgets
)

budgetRouter.put(
    `${urlPrefix}/:id/:budgetId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    budgetController.updateBudget
)

budgetRouter.delete(
    `${urlPrefix}/:id/:budgetId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    budgetController.removeBudget
)

export default budgetRouter
