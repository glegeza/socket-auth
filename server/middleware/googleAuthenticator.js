const passport = require('passport');

module.exports = passport.authenticate(
    'google',
    {scope: ['email'],
    prompt: 'select_account'}
);
