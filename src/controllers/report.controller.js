import ExcelJS from 'exceljs'
import * as transactionService from '../services/transaction.service.js'
import * as budgetService from '../services/budget.service.js'
import * as goalService from '../services/goal.service.js'
import { createAPIResponse } from '../utils/request-validations.js'
import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'

const generateReportData = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
                success: false,
                message: 'User ID is required',
            })
        }

        const transactions = await transactionService.getAll(id)
        const budgets = await budgetService.getAll(id)
        const goals = await goalService.getAll(id)

        const report = {
            transactions,
            budgets,
            goals,
        }

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Report')

        worksheet.columns = [
            { header: 'Type', key: 'type', width: 20 },
            { header: 'Amount', key: 'amount', width: 20 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Tags', key: 'tags', width: 20 },
            { header: 'Date', key: 'date', width: 20 },
        ]

        transactions.forEach((transaction) => {
            worksheet.addRow({
                type: 'Transaction',
                amount: transaction.amount,
                category: transaction.category,
                tags: transaction.tags.join(', '),
                date: transaction.date,
            })
        })

        budgets.forEach((budget) => {
            worksheet.addRow({
                type: 'Budget',
                amount: budget.amount,
                category: budget?.category || '',
                tags: budget?.tags?.join(', ') || '',
                date: budget.startDate,
            })
        })

        goals.forEach((goal) => {
            worksheet.addRow({
                type: 'Goal',
                amount: goal.amount,
                category: goal?.category || '',
                tags: goal?.tags?.join(', ') || '',
                date: goal?.startDate || '',
            })
        })

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx')

        await workbook.xlsx.write(res)
        res.end()
    } catch (error) {
        next(error)
    }
}

export default generateReportData
