const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const socketIO = require('socket.io');
const MongoDBStore = require('connect-mongodb-session')(session);

const config = require('./config');

const server = http.createServer(app);
const io = socketIO(server);

const mongoose = require('./services/mongoose');
const passport = require('./services/passport');
const routes = require('./routes');

// Middleware
const store = new MongoDBStore({
    uri: config.mongoURI,
    databaseName: config.mongoDB,
    collection: 'sessions',
});

app.use(bodyParser.json());
app.use(require('express-session')({
    secret: config.sessionSecret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

server.listen(config.serverPort, () => {
    console.log(`Server in ${process.env.NODE_ENV} environment`);
    console.log(`Server listening on port ${config.serverPort}`);
});
