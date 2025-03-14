import ExcelJS from 'exceljs'
import * as transactionService from '../services/transaction.service.js'
import * as budgetService from '../services/budget.service.js'
import * as goalService from '../services/goal.service.js'
import { createAPIResponse } from '../utils/request-validations.js'
import { APP_ERROR_MESSAGE, HTTP_RESPONSE_CODE } from '../config/constants.js'

export const generateReportData = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({
                success: false,
                message: 'User ID is required',
            })
        }

        const transactions = await transactionService.getAllNonPaginated(id)

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
                type: transaction.type,
                amount: transaction.amount,
                category: transaction.category.name,
                tags: transaction.tags.join(', '),
                date: transaction.date,
            })
        })

        const timestamp = new Date().toISOString().replace(/[-:.]/g, '_')
        const filename = `transaction_report_${timestamp}.xlsx`
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`)

        await workbook.xlsx.write(res)
        res.end()
    } catch (error) {
        next(error)
    }
}

export const userSummary = async (req, res, next) => {
    try {
        const { balance, income, expense } =
            await transactionService.getCurrentBalance(req.params.id)

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('User Summary')

        worksheet.columns = [
            { header: 'Current Balance', key: 'currentBalance', width: 20 },
            { header: 'Total Income', key: 'totalIncome', width: 20 },
            { header: 'Total Expense', key: 'totalExpense', width: 20 },
        ]

        worksheet.addRow({
            currentBalance: balance,
            totalIncome: income,
            totalExpense: expense,
        })

        const timestamp = new Date().toISOString().replace(/[-:.]/g, '_')
        const filename = `user_summary_${timestamp}.xlsx`
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`)

        await workbook.xlsx.write(res)
        res.end()
    } catch (error) {
        next(error)
    }
}
