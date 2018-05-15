if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}
