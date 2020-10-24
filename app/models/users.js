const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    score: {
        type: Number,
    },
    timetaken:{
        type: Number,
    },
    type: {
        type: String,
    },
})

module.exports = mongoose.model('Users', usersSchema);