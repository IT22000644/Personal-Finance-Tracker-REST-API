import { isObjectIdOrHexString, Types } from 'mongoose'

export const isEmail = (prop) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
    return !!prop?.match(regex)
}

const isStrongPassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    return !!password?.match(regex)
}

const isValidDate = (prop) => {
    return !Number.isNaN(Date.parse(prop))
}

const hasWhiteSpace = (prop) => {
    return /\s/g.test(prop)
}

export const validUserRequest = (prop) => {
    const error = {}
    if (!Object.keys(prop).length) {
        error.body = 'The request body cannot be empty'
        return error
    }

    if (
        !prop.username ||
        typeof prop.username !== 'string' ||
        hasWhiteSpace(prop.username)
    ) {
        error.username =
            'Username is required and must be a string with no spaces'
    }

    if (!prop.firstname || typeof prop.firstname !== 'string') {
        error.firstname = 'Firstname is required and must be a string'
    }

    if (!prop.lastname || typeof prop.lastname !== 'string') {
        error.lastname = 'Lastname is required and must be a string'
    }

    if (!prop.email || !isEmail(prop.email)) {
        error.email = 'Provide a valid email'
    }

    if (
        !prop.dob ||
        !isValidDate(prop.dob) ||
        new Date(prop.dob) >= new Date()
    ) {
        error.dob =
            'Date of birth is required and must be a valid date in the past'
    }

    if (!prop.password || !isStrongPassword(prop.password)) {
        error.password = 'Password does not follow the standard policies'
    }

    if (!prop.role || !['User', 'Admin'].includes(prop.role)) {
        error.role = 'Role is required and must be either "User" or "Admin"'
    }

    if (!prop.country || typeof prop.country !== 'string') {
        error.country = 'Country is required and must be a string'
    }

    if (!prop.defaultCurrency || typeof prop.defaultCurrency !== 'string') {
        error.defaultCurrency =
            'Default currency is required and must be a string'
    }

    return error
}

export const validateUserUpdateRequest = (props) => {
    const error = {}
    if (!Object.keys(props).length) {
        error.body = 'The request body cannot be empty'
        return error
    }

    Object.entries(props).forEach(([key, value]) => {
        if (
            key === 'username' &&
            (typeof value !== 'string' || hasWhiteSpace(value))
        ) {
            error.username =
                'Username is required and must be a string with no spaces'
        }
        if (key === 'firstname' && typeof value !== 'string') {
            error.firstname = 'Firstname is required and must be a string'
        }
        if (key === 'lastname' && typeof value !== 'string') {
            error.lastname = 'Lastname is required and must be a string'
        }
        if (key === 'email' && isEmail(value)) {
            error.email = 'Provide a valid email'
        }
        if (
            key === 'dob' &&
            (!isValidDate(value) || new Date(value) >= new Date())
        ) {
            error.dob =
                'Date of birth is required and must be a valid date in the past'
        }
        if (key === 'password' && isStrongPassword(value)) {
            error.password = 'Password does not follow the standard policies'
        }
    })
}

export const validateCategoryRequest = (props) => {
    const error = {}

    if (!Object.keys(props).length) {
        error.body = "Category details can't be empty"
    }

    Object.entries(props).forEach(([key, value]) => {
        if (
            key === 'name' &&
            (typeof value !== 'string' || hasWhiteSpace(value))
        ) {
            error.name =
                'Category name should be a string and should not contain spaces'
        }
    })

    return error
}

export const validateTransactionCreateRequest = (
    props,
    categories,
    currBalance
) => {
    const error = {}
    const {
        user,
        amount,
        date,
        description,
        isRecurring,
        recurringFrequency,
        status,
        type,
        category,
        goal,
        startDate,
        endDate,
    } = props

    if (!Object.keys(props).length) {
        error.body = 'Request body cannot be empty'
        return error
    }

    if (!amount || typeof amount !== 'number') {
        error.amount = 'Amount is required and must be a positive number'
    }

    if (!description || typeof description !== 'string') {
        error.description = 'Description is required and must be a string'
    }

    if (isRecurring && typeof isRecurring !== 'boolean') {
        error.isRecurring = 'isRecurring must be a boolean'
    }

    if (
        isRecurring &&
        (!recurringFrequency ||
            !['daily', 'weekly', 'monthly', 'yearly'].includes(
                recurringFrequency
            ))
    ) {
        error.recurringFrequency =
            'Recurring frequency is required and must be one of "daily", "weekly", "monthly", or "yearly"'
    }

    if (isRecurring && new Date(startDate) < new Date()) {
        error.startDate =
            'Start date must be in the future for recurring transactions'
    }

    if (!isRecurring && new Date(startDate) > new Date()) {
        error.startDate =
            'End date must be later than the starting date for non-recurring transactions'
    }

    if (!amount || typeof amount !== 'number') {
        error.amount = 'Amount is required and must be a positive number'
    }

    if (!description || typeof description !== 'string') {
        error.description = 'Description is required and must be a string'
    }

    if (
        !category ||
        !isObjectIdOrHexString(category) ||
        !categories.some((cat) => cat.equals(new Types.ObjectId(category)))
    ) {
        error.category =
            'Category is required and must be a valid ObjectId from the available categories'
    }

    if (goal && !isObjectIdOrHexString(goal)) {
        error.goal = 'Goal must be a valid ObjectId'
    }

    return error
}

export const validateTransactionUpdateRequest = (
    props,
    categories,
    currBalance
) => {
    const error = {}
    const {
        amount,
        date,
        description,
        isRecurring,
        recurringFrequency,
        status,
        category,
        goal,
        startDate,
        endDate,
    } = props

    if (!Object.keys(props).length) {
        error.body = 'Request body cannot be empty'
        return error
    }

    if (!isRecurring && amount) {
        error.amount = 'Amount is not allowed to be changed'
    }

    if (description && typeof description !== 'string') {
        error.description = 'Description is required and must be a string'
    }

    if (isRecurring && typeof isRecurring !== 'boolean') {
        error.isRecurring = 'isRecurring must be a boolean'
    }

    if (
        isRecurring &&
        (!recurringFrequency ||
            !['daily', 'weekly', 'monthly', 'yearly'].includes(
                recurringFrequency
            ))
    ) {
        error.recurringFrequency =
            'Recurring frequency is required and must be one of "daily", "weekly", "monthly", or "yearly"'
    }

    if (isRecurring) {
        error.recurring =
            'Cannot update existing transaction to recur, please create a new transaction'
    }

    if (amount && typeof amount !== 'number') {
        error.amount = 'Amount is required and must be a positive number'
    }

    if (description && typeof description !== 'string') {
        error.description = 'Description is required and must be a string'
    }

    if (
        category &&
        !isObjectIdOrHexString(category) &&
        !categories.some((cat) => cat.equals(new Types.ObjectId(category)))
    ) {
        error.category =
            'Category is required and must be a valid ObjectId from the available categories'
    }

    if (goal && !isObjectIdOrHexString(goal)) {
        error.goal = 'Goal must be a valid ObjectId'
    }

    return error
}

export const validateGoalRequest = (props, categories) => {
    const error = {}

    if (!Object.keys(props).length) {
        error.body = 'Request body cannot be empty'
        return error
    }

    const { title, targetAmount, targetDate, category } = props

    if (!title || typeof title !== 'string') {
        error.title = 'Title is required and must be a string'
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
        error.targetAmount =
            'Target amount is required and must be a positive number'
    }

    if (!targetDate || new Date(targetDate) < new Date()) {
        error.targetDate = 'Target date is required and must be in the future'
    }

    if (
        !category ||
        !isObjectIdOrHexString(category) ||
        !categories.some((cat) => cat.equals(new Types.ObjectId(category)))
    ) {
        error.category =
            'Category is required and must be a valid ObjectId from the available categories'
    }

    return error
}

export const validateBudgetRequest = (props) => {
    const error = {}
    const { user, amount, period, category, tags, startDate, endDate } = props

    if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
        error.amount = 'Amount is required and must be a positive number'
    }

    if (!period || !['weekly', 'monthly'].includes(period)) {
        error.period =
            'Period is required and must be either "weekly" or "monthly"'
    }

    if (category && !isObjectIdOrHexString(category)) {
        error.category = 'Category must be a valid ObjectId'
    }

    if (tags && !Array.isArray(tags)) {
        error.tags = 'Tags must be an array of strings'
    }

    if (
        startDate &&
        (Number.isNaN(Date.parse(startDate)) ||
            new Date(startDate) < new Date())
    ) {
        error.startDate = 'Start date must be a valid date'
    }

    if (
        endDate &&
        (Number.isNaN(Date.parse(endDate)) || new Date(endDate) < new Date())
    ) {
        error.endDate = 'End date must be a valid date'
    }

    return error
}

export const createAPIResponse = (success, code, message, data, request) => {
    return {
        success,
        code,
        message,
        data,
        request,
    }
}
