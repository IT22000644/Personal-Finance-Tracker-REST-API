import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    targetDate: {
        type: Date,
        required: true,
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
})

// eslint-disable-next-line func-names
goalSchema.pre('save', function (next) {
    this.updatedDate = Date.now()
    next()
})

const Goal = mongoose.model('Goal', goalSchema)

export default Goal
