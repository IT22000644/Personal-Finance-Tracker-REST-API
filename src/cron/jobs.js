import cron from 'node-cron'
import retryPendingPayments from './retryPendingPayments.js'
import checkRecurringPayments from './checkRecurringPayments.js'
import checkBudgets from './resetBudgets.js'
import logger from '../utils/logger.js'
import updatePaymentStatus from './updatePaymentStatus.js'

const retryPendingPaymentsJob = cron.schedule('0 * * * *', retryPendingPayments)
const checkRecurringPaymentsJob = cron.schedule(
    '0 0 * * *',
    checkRecurringPayments
)
const resetBudgetsJob = cron.schedule('0 0 * * *', checkBudgets)
const updatePaymentStatusJob = cron.schedule('0 0 * * *', updatePaymentStatus)
const checkBudgetsJob = cron.schedule('0 0 * * *', checkBudgets)

logger.info('Cron jobs scheduled successfully.')

export { retryPendingPaymentsJob, checkRecurringPaymentsJob, checkBudgetsJob }
