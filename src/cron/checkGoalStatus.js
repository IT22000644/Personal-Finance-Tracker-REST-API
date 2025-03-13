import Goal from '../models/goal.model.js'
import sendEmail from '../utils/sendEmail.js'
import logger from '../utils/logger.js'

const checkGoalStatus = async () => {
    try {
        const today = new Date()
        const twoDaysFromNow = new Date(today)
        twoDaysFromNow.setDate(today.getDate() + 2)

        // Fetch goals with target dates in 2 days
        const goals = await Goal.find({
            targetDate: {
                $gte: twoDaysFromNow.setHours(0, 0, 0, 0),
                $lt: twoDaysFromNow.setHours(23, 59, 59, 999),
            },
        }).populate('user', 'email username')

        // Filter goals where the target amount has not been reached
        const goalsToNotify = goals.filter(
            (goal) => goal.currentAmount < goal.targetAmount
        )

        // Send an email to the customers of those goals
        await Promise.all(
            goalsToNotify.map(async (goal) => {
                const { user, targetAmount, currentAmount, name } = goal
                const emailContent = `
                    Dear ${user.username},

                    This is a reminder that your goal "${name}" is due in 2 days. 
                    Your target amount is $${targetAmount}, but you have only reached $${currentAmount} so far.

                    Please take the necessary steps to reach your goal.

                    Best regards,
                    Finance Manager
                `

                await sendEmail(
                    user.email,
                    'Goal Status Reminder',
                    emailContent
                )
            })
        )

        logger.info(
            'Goal statuses checked and notifications sent successfully.'
        )
    } catch (error) {
        logger.error('Error checking goal statuses: ', error)
    }
}

export default checkGoalStatus
