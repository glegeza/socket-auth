const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../config');

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

passport.use(new GoogleStrategy({
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: '/api/auth/google/callback',
        proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({google: profile.id});
        if (existingUser) {
            console.log('Found existing google user');
            return done(null, existingUser);
        }

        for (let i = 0; i < profile.emails.length; i++) {
            const email = profile.emails[i].value;
            const userWithEmail = await User.findOne({email});
            if (userWithEmail) {
                console.log('User with email exists, associating account');
                userWithEmail.google = profile.id;
                const updatedUser = await userWithEmail.save();
                return done(null, updatedUser);
            }
        }

        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;

        console.log('Creating new google user');
        const newUser =
            await new User({firstName, lastName, email, google: profile.id})
                .save();

        return done(null, newUser);
    },
));

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
