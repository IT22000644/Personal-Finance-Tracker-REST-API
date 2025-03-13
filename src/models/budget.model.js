import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        required: true,
    },
    period: {
        type: String,
        enum: ['weekly', 'monthly'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false, // Optional, can be null for all categories
    },
    tags: {
        type: [String],
        default: [],
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: false,
    },
})

const Budget = mongoose.model('Budget', budgetSchema)

export default Budget
