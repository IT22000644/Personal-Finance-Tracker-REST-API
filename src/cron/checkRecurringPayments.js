import Transaction from '../models/transaction.model.js'
import { getCurrentBalance } from '../services/transaction.service.js'
import logger from '../utils/logger.js'
import sendEmail from '../utils/sendEmail.js'
import * as goalService from '../services/goal.service.js'
import * as transactionService from '../services/transaction.service.js'

const checkRecurringPayments = async () => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const recurringPayments = await Transaction.find({
            isRecurring: true,
            isActive: true,
        })

        const dueTransactions = recurringPayments.filter((transaction) => {
            const lastPaymentate = new Date(transaction.date)
            let nextPaymentDate

            switch (transaction.recurringFrequency) {
                case 'daily':
                    nextPaymentDate = new Date(
                        lastPaymentate.setDate(lastPaymentate.getDate() + 1)
                    )
                    break
                case 'weekly':
                    nextPaymentDate = new Date(
                        lastPaymentate.setDate(lastPaymentate.getDate() + 7)
                    )
                    break
                case 'monthly':
                    nextPaymentDate = new Date(
                        lastPaymentate.setMonth(lastPaymentate.getMonth() + 1)
                    )
                    break
                case 'yearly':
                    nextPaymentDate = new Date(
                        lastPaymentate.setFullYear(
                            lastPaymentate.getFullYear() + 1
                        )
                    )
                    break
                default:
                    return false
            }

            nextPaymentDate.setHours(0, 0, 0, 0)
            return nextPaymentDate.getTime() === today.getTime()
        })

        if (dueTransactions.length === 0) {
            logger.info('No recurring payments due today.')
            return
        }

        await Promise.all(
            dueTransactions.map(async (transaction) => {
                const { user, amount, type, goal } = transaction

                let newStatus
                if (type === 'income') {
                    newStatus = 'completed'
                } else if (type === 'expense') {
                    const { balance } = await getCurrentBalance(user)
                    newStatus = amount <= balance ? 'completed' : 'pending'

                    if (newStatus === 'pending' && user.email) {
                        await sendEmail(
                            user.email,
                            'Payment Pending',
                            `Dear ${user.username},\n\nYour recurring payment of $${amount} for ${goal.name} is pending. Please ensure you have sufficient funds in your account.\n\nRegards,\nBudget Manager`
                        )
                    }
                }

                const newTransaction = new Transaction({
                    ...transaction._doc,
                    _id: undefined, // Remove the _id field to create a new document
                    date: today,
                    status: newStatus,
                })

                const createdTransaction =
                    await transactionService.create(newTransaction)

                if (goal && newStatus === 'completed') {
                    const goalDoc = await goalService.get(transaction.goal)
                    if (goalDoc) {
                        goalDoc.currentAmount += transaction.amount
                        await goalService.update(goalDoc._id, goalDoc)
                    }
                }
            })
        )

        logger.info('Recurring payments checked successfully')
    } catch (error) {
        logger.error('Error checking recurring payments: ', error)
    }
}

export default checkRecurringPayments
