import Budget from '../models/budget.model.js'
import * as budgetServices from '../services/budget.service.js'
import logger from '../utils/logger.js'

const checkBudgets = async () => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const budgets = await Budget.find({
            $or: [{ endDate: { $exists: false } }, { endDate: { $gt: today } }],
        })

        await Promise.all(
            budgets.map(async (budget) => {
                const { startDate, period } = budget
                let nextPeriodDate

                switch (period) {
                    case 'weekly':
                        nextPeriodDate = new Date(
                            startDate.setDate(startDate.getDate() + 7)
                        )
                        break
                    case 'monthly':
                        nextPeriodDate = new Date(
                            startDate.setMonth(startDate.getMonth() + 1)
                        )
                        break
                    default:
                }

                nextPeriodDate.setHours(0, 0, 0, 0)

                if (nextPeriodDate.getTime() === today.getTime()) {
                    const updatedBudget = {
                        ...budget._doc,
                        startDate: today,
                        currentAmount: 0,
                    }

                    await budgetServices.updateBudget(budget._id, updatedBudget)
                    logger.info(
                        `Budget for user ${budget.user} updated successfully.`
                    )
                }
            })
        )

        logger.info('Budgets checked and update successfully')
    } catch (error) {
        logger.error('Error checking budgets: ', error)
    }
}

export default checkBudgets
