const authUpdater = require('../middleware/socketio/authUpdater');

module.exports = (io, store) => {
    const users = {};

    io.on('connection', (socket) => {
        console.log(
            'Received socket connection with session ID',
            socket.request.sessionID);

        socket.use(authUpdater(socket, store, users));

        let isUpdating = false;

        if (socket.request.user.logged_in) {
            if (!users.hasOwnProperty(socket.request.user.email)) {
                users[socket.request.user.email] = {};
            }
            console.log(
                `Socket user is logged in as ${socket.request.user.email}`);
            socket.emit('auth', socket.request.user);
        } else {
            console.log('User is not logged in');
            socket.emit('no_auth');
        }

        socket.on('status', () => {
            console.log('Received request to update login status');
            if (socket.has_auth) {
                if (!users.hasOwnProperty(socket.request.user.email)) {
                    users[socket.request.user.email] = {};
                }
                console.log(
                    `User is logged in as ${socket.request.user.email}`);
                socket.emit('auth', socket.request.user);
            } else {
                if (users.hasOwnProperty(socket.request.user.email)) {
                    delete users[socket.request.user.email];
                }
                console.log('User is not logged in');
                socket.emit('no_auth');
            }
            console.log(users);
        });

        socket.on('update', () => {
            console.log('Received fake update request');
            if (socket.has_auth && !isUpdating) {
                isUpdating = true;
                console.log('Doin that false update');
                setTimeout(() => {
                    isUpdating = false;
                    console.log('done fake updating');
                }, 5000);
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
};
