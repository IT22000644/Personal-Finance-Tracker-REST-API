import { Router } from 'express'

import {
    userSummary,
    generateReportData,
} from '../controllers/report.controller.js'

const reportRouter = Router()

const urlPrefix = '/reports'

reportRouter.get(`${urlPrefix}/transactions/:id`, generateReportData)
reportRouter.get(`${urlPrefix}/summary/:id`, userSummary)

export default reportRouter
