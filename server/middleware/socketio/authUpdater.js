module.exports = (socket, store) => {
    return (s, next) => {
        console.log('In auth updater');
        store.get(socket.request.sessionID, (err, session) => {
            if (session.passport && session.passport.user) {
                socket.has_auth = true;
            } else {
                socket.has_auth = false;
            }
            next();
        });
    };
};
