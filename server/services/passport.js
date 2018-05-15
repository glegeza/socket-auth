const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('User');

console.log('Initializing passport...');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.log('Failed to deserialize user');
    }
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const existingUser = await User.findByCredentials(email, password);
            if (existingUser) {
                console.log(`Found existing user with email ${email}`);
                return done(null, existingUser);
            } else {
                const err = 'Invalid email or password';
                console.log(err);
                return done(err, null);
            }
        } catch (err) {
            const msg = 'DB error attempting to retrieve user';
            console.log(msg, err);
            done(msg, null);
        }
    })
);

module.exports = passport;
