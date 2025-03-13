import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required() {
            return this.isRecurring
        },
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'faild'],
        default: 'pending',
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: false,
    },
    startDate: {
        type: Date,
        required() {
            return this.isRecurring
        },
    },
    endDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
})

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
