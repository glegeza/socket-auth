const router = require('express').Router(); // eslint-disable-line new-cap
const userRoutes = require('./users');
const authRoutes = require('./auth');
const meRoutes = require('./me');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/me', meRoutes);

module.exports = router;
