const router = require('express').Router(); // eslint-disable-line new-cap
const apiRoutes = require('./api');

router.get('/', (req, res) => {
    res.send(req.session);
});

router.use('/api', apiRoutes);

module.exports = router;
