import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    dob: {
        type: Date,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        required: true,
        default: 'User',
    },
    country: {
        type: String,
        required: true,
    },
    defaultCurrency: {
        type: String,
        required: true,
    },
    joinedOn: {
        type: Date,
        default: new Date(),
    },
    lastLogin: {
        type: Date,
    },
})

const User = mongoose.model('User', userSchema)

export default User
