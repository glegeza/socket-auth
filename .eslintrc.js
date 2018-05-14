module.exports = {
    "parser": "babel-eslint",
    "env" : {
        "es6": true,
    },
    "rules" : {
        "linebreak-style": 0,
        "require-jsdoc": 0,
        "no-unused-vars": 0,
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
        }
    },
    "plugins": [
        "babel"
    ],
    "extends": "google"
};