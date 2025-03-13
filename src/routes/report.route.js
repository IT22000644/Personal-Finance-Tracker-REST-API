import { Router } from 'express'

import generateReportData from '../controllers/report.controller.js'

const reportRouter = Router()

const urlPrefix = '/reports'

reportRouter.get(`${urlPrefix}/:id`, generateReportData)

export default reportRouter
