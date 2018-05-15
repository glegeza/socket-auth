const router = require('express').Router(); // eslint-disable-line new-cap
const localAuthenticator = require('../../middleware/localAuthenticator');
const isNotLoggedIn = require('../../middleware/isNotLoggedIn');
const config = require('../../config');

