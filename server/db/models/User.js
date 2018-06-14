const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {Schema} = mongoose;

const oauthIdType = {
    type: String,
    unique: false,
    default: '',
    required: false,
};

const userSchema = new Schema({
    github: oauthIdType,
    twitter: oauthIdType,
    google: oauthIdType,
    firstName: {
        type: String,
        unique: false,
    },
    lastName: {
        type: String,
        unique: false,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
        },
    },
    password: {
        type: String,
        unique: false,
        required: false,
    },
});

userSchema.methods.public = function() {
    let user = this.toObject(); // eslint-disable-line no-invalid-this
    user = _.pick(user, ['email', 'firstName', 'lastName']);
    return user;
};

userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();
    const reduced = _.pick(userObj, ['email', 'firstName', 'lastName']);
    return {
        ...reduced,
        google: userObj.google && userObj.google !== '' ? true : false,
        twitter: userObj.twitter && userObj.twitter !== '' ? true : false,
        github: userObj.github && userObj.github !== '' ? true : false,
        local: userObj.password && userObj.password !== '' ? true : false,
    };
};

userSchema.statics.findByCredentials = function(email, password) {
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject('User with email not found');
        }
        if (!user.password) {
            return Promise.reject('User missing local credentials');
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject('Password incorrect');
                }
            });
        });
    });
};

userSchema.pre('save', function(next) {
    const user = this; // eslint-disable-line no-invalid-this

    if (user.password && user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);
