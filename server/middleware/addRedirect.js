const config = require('../config');

module.exports = (req, res, next) => {
    req.session.authRedirect = `${config.clientPath}${req.query.redirect}`;
    next();
};
