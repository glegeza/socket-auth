module.exports = (socket, store) => {
    return (s, next) => {
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
