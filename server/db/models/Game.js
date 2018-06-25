const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {Schema} = mongoose;

const gameSchema = new Schema({
    isRunning: {
        type: Boolean,
        required: true,
        default: false,
    },
    isComplete: {
        type: Boolean,
        required: true,
        default: false,
    },
    timeRunning: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Game = mongoose.model('Game', gameSchema);
