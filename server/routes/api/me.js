const router = require('express').Router(); // eslint-disable-line new-cap
const isLoggedIn = require('../../middleware/isLoggedIn');

router.get('/', isLoggedIn, (req, res) => {
    res.send(req.user);
});

router.delete('/logout', isLoggedIn, (req, res) => {
    const user = req.user;
    req.logout();
    res.send(user);
});

module.exports = router;
