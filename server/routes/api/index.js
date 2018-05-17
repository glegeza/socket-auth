const router = require('express').Router(); // eslint-disable-line new-cap
const userRoutes = require('./users');
const authRoutes = require('./auth');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
