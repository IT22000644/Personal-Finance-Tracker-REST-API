import cron from 'node-cron'
import Transaction from '../models/transaction.model.js'
import { getCurrentBalance } from '../services/transaction.service.js'
import * as budgetService from '../services/budget.service.js'
import logger from '../utils/logger.js'
import sendEmail from '../utils/sendEmail.js'

const retryPendingPayments = async () => {
    try {
        const pendingTransactions = await Transaction.find({
            isActive: true,
            status: 'pending',
            type: 'expense',
        }).populate('user', 'email username') // Ensure user data is available

        if (pendingTransactions.length === 0) {
            logger.info('No pending transactions to process.')
            return
        }

        await Promise.all(
            pendingTransactions.map(async (transaction) => {
                try {
                    const { balance } = await getCurrentBalance(
                        transaction.user
                    )

                    const newStatus =
                        transaction.amount <= balance ? 'completed' : 'failed'

                    await Transaction.updateOne(
                        { _id: transaction._id },
                        { $set: { status: newStatus } }
                    )

                    if (newStatus === 'completed') {
                        // Update budgets associated with the completed transaction
                        const budgets = await budgetService.getAll(
                            transaction.user
                        )
                        await Promise.all(
                            budgets.map(async (budget) => {
                                const isCategoryMatch = budget.category.equals(
                                    transaction.category
                                )
                                const isTagMatch = budget.tags.some((tag) =>
                                    transaction.tags.includes(tag)
                                )
                                const isUncategorized =
                                    !transaction.category && !budget.category
                                const isUntagged =
                                    !transaction.tags.length &&
                                    !budget.tags.length

                                if (
                                    isCategoryMatch ||
                                    isTagMatch ||
                                    isUncategorized ||
                                    isUntagged
                                ) {
                                    const updatedBudget = {
                                        ...budget._doc,
                                        amount:
                                            budget.amount + transaction.amount,
                                    }
                                    await budgetService.update(
                                        budget._id,
                                        updatedBudget
                                    )
                                }
                            })
                        )
                    }

                    // Send an email if the transaction fails
                    if (newStatus === 'failed' && transaction.user?.email) {
                        await sendEmail(
                            transaction.user.email,
                            'Transaction Failed',
                            `Dear ${transaction.user.username},\n\nUnfortunately, your transaction of $${transaction.amount} has failed due to insufficient balance.\n\nPlease ensure sufficient funds and try again.\n\nBest regards,\nYour Company`
                        )
                    }
                } catch (error) {
                    logger.error(
                        `Error processing transaction ${transaction._id}:`,
                        error
                    )
                }
            })
        )

        logger.info(
            `Processed ${pendingTransactions.length} pending transactions.`
        )
    } catch (error) {
        logger.error('Error in retryPendingPayments cron job:', error)
    }
}

export default retryPendingPayments
