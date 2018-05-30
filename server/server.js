const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const socketIO = require('socket.io');
const passportSocketIO = require('passport.socketio');
const cookieParser = require('cookie-parser');
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

io.use(passportSocketIO.authorize({
    key: 'connect.sid',
    secret: config.sessionSecret,
    store, passport, cookieParser,
    success: (data, accept) => {
        console.log('got successful connection');
        accept();
    },
    fail: (data, msg, error, accept) => {
        if (error) {
            throw new Error(error);
        }
        console.log('got unauthorized connection');
        accept(null, false);
    },
}));

const users = {};

io.on('connection', (socket) => {
    console.log('received connection');
    console.log(socket.request.sessionID);
    store.get(socket.request.sessionID, (err, session) => {
        console.log(session);
    });

    socket.use((s, next) => {
        console.log('in auth checker middleware!');
        console.log(s);
        store.get(socket.request.sessionID, (err, session) => {
            if (session.passport && session.passport.user) {
                console.log('authed');
                socket.has_auth = true;
            } else {
                console.log('not authed');
                socket.has_auth = false;
            }
            next();
        });
    });

    if (socket.request.user.logged_in) {
        if (!users.hasOwnProperty(socket.request.user.email)) {
            users[socket.request.user.email] = {};
        }
        socket.emit('auth', socket.request.user);
        console.log(users);
    } else {
        console.log('not authorized');
        socket.emit('no_auth');
    }

    socket.on('status', () => {
        console.log('got status request');
        if (socket.has_auth) {
            socket.emit('auth');
        } else {
            socket.emit('no_auth');
        }
    });

    socket.on('disconnect', () => {
        if (socket.request.user.logged_in) {
            if (users.hasOwnProperty(socket.request.user.email)) {
                delete users[socket.request.user.email];
            }
            console.log(users);
        }
    });
});

server.listen(config.serverPort, () => {
    console.log(`Server in ${process.env.NODE_ENV} environment`);
    console.log(`Server listening on port ${config.serverPort}`);
});

// auth.store.get(data.sessionID, function(err, session){
//     if(err)
//       return auth.fail(data, 'Error in session store:\n' + err.message, true, accept);
//     if(!session)
//       return auth.fail(data, 'No session found', false, accept);
//     if(!session[auth.passport._key])
//       return auth.fail(data, 'Passport was not initialized', true, accept);

//     var userKey = session[auth.passport._key].user;

//     if(typeof(userKey) === 'undefined')
//       return auth.fail(data, 'User not authorized through passport. (User Property not found)', false, accept);

//     auth.passport.deserializeUser(userKey, data, function(err, user) {
//       if (err)
//         return auth.fail(data, err, true, accept);
//       if (!user)
//         return auth.fail(data, "User not found", false, accept);
//       data[auth.userProperty] = user;
//       data[auth.userProperty].logged_in = true;
//       auth.success(data, accept);
//     });

//   });