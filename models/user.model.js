import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: null
    },
    middlename: {
        type: String,
        default: null
    },
    surname: {
        type: String,
        default: null
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String,
        required: true,
    }
})

export const User = mongoose.model('User', userSchema)