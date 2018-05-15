const router = require('express').Router(); // eslint-disable-line new-cap
const passport = require('passport');
const {getAllDocuments} = require('../../util/basicGetRoutes');

const User = require('mongoose').model('User');

router.post('/', async (req, res) => {
    const {email, password, firstName, lastName} = req.body;

    if (!(firstName && lastName && email && password)) {
        return res.status(400).send('Name, email, and password required');
    }

    const user = User.findOne({email});
    if (user) {
        return res.status(400).send('User with email already exists!');
    }

    console.log(`Attempting to create new user with email ${email}`);
    try {
        const newUser = await new User({
            firstName, lastName, email, password,
        }).save();
        console.log('User created');
        res.send(newUser);
    } catch (err) {
        console.log(err);
        res.status(400).send('Server error creating new user.');
    }
});

router.get('/', getAllDocuments(User));

module.exports = router;
