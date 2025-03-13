import Transaction from '../models/transaction.model.js'
import logger from '../utils/logger.js'

const updatePaymentStatus = async () => {
    try {
        // Fetch all inactive payments
        const inactiveTransactions = await Transaction.find({ isActive: false })

        // Get today's date
        const today = new Date()

        const updatedPayments = await Promise.all(
            inactiveTransactions.map(async (transaction) => {
                if (new Date(transaction.startDate) < today) {
                    const updatedTransaction = {
                        ...transaction._doc,
                        isActive: true,
                        date: today,
                    }
                    await Transaction.updateOne(
                        { _id: transaction._id },
                        updatedTransaction
                    )
                }
                return null
            })
        )
        logger.info('Updated payments:', updatedPayments)
    } catch (error) {
        logger.error('Error updating payment status:', error)
    }
}

export default updatePaymentStatus
