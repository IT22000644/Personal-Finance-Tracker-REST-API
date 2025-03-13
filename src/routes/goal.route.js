import { Router } from 'express'
import * as goalController from '../controllers/goal.controller.js'
import authenticateMiddlware from '../middleware/authenticate.middleware.js'
import authorizeMiddlware from '../middleware/authorize.middlware.js'

const goalRouter = new Router()

const urlPrefix = '/goal'

goalRouter.post(
    `${urlPrefix}/:id/`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    goalController.createGoal
)
goalRouter.get(
    `${urlPrefix}/:id/:goalId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    goalController.getGoal
)
goalRouter.put(
    `${urlPrefix}/:id/:goalId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    goalController.updateGoal
)
goalRouter.delete(
    `${urlPrefix}/:id/:goalId`,
    authenticateMiddlware,
    authorizeMiddlware(['User']),
    goalController.deleteGoal
)

export default goalRouter
