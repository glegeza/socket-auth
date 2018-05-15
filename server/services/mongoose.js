const mongoose = require('mongoose');
const {mongoURI} = require('../config');

console.log('Initializing database connection...');

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, async (err, db) => {
    if (err) {
        console.log('Failed to connect to Mongoose DB.', err);
    } else {
        console.log('Mongoose connection complete');
    }
});

require('../db/models');

module.exports = {mongoose};
