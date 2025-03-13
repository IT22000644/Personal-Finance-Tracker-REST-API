import { Router } from 'express'
import authenticateMiddlware from '../middleware/authenticate.middleware.js'
import authorizeMiddlware from '../middleware/authorize.middlware.js'
import {
    createCategory,
    getCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} from '../controllers/category.controller.js'

const categoryRouter = Router()

const urlPrefix = '/category'

categoryRouter.post(
    urlPrefix,
    authenticateMiddlware,
    authorizeMiddlware(['Admin']),
    createCategory
)
categoryRouter.get(`${urlPrefix}/:id`, getCategory)
categoryRouter.get(`${urlPrefix}/`, getAllCategories)
categoryRouter.put(
    `${urlPrefix}/:id`,
    authenticateMiddlware,
    authorizeMiddlware(['Admin']),
    updateCategory
)
categoryRouter.delete(
    `${urlPrefix}/:id`,
    authenticateMiddlware,
    authorizeMiddlware(['Admin']),
    deleteCategory
)

export default categoryRouter
