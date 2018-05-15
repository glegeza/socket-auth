module.exports = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.status(400).send('Request invalid while logged in');
    }
};
