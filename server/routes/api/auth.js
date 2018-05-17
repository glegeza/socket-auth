const router = require('express').Router(); // eslint-disable-line new-cap
const localAuthenticator = require('../../middleware/localAuthenticator');
const googleAuthenticator = require('../../middleware/googleAuthenticator');
const isNotLoggedIn = require('../../middleware/isNotLoggedIn');
const config = require('../../config');

router.get('/', localAuthenticator, (req, res) => {
    res.send(req.user);
});

router.get('/google', googleAuthenticator);

router.get(
    '/google/callback',
    googleAuthenticator,
    (req, res) => {
        res.send(req.user);
    }
);

module.exports = router;
