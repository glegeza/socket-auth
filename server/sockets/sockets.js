const authUpdater = require('../middleware/socketio/authUpdater');
const mongoose = require('mongoose');

const Game = mongoose.model('Game');
const User = mongoose.model('User');

module.exports = (io, store, games) => {
    const users = {};

    io.on('connection', async (socket) => {
        console.log(
            'Received socket connection with session ID',
            socket.request.sessionID);

        socket.use(authUpdater(socket, store, users));

        let game = null;
        let isUpdating = false;
        let isBusy = false;
        let activeGame = null;

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
                console.log('User is not logged in, session ID',
                    socket.request.sessionID);
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

        socket.on('game_resume', async () => {
            console.log('Received request to resume game');
            if (socket.has_auth && socket.request.user.activeGame && !game) {
                console.log('found existing game');
                game = await Game.findById(socket.request.user.activeGame);
                game.isRunning = true;
                await game.save();
                games[game.id] = {game, time: game.timeRunning};
            }
        });

        socket.on('game_start', async () => {
            console.log('Received request to start game');
            console.log(game, socket.request.user);
            if (socket.has_auth && !socket.request.user.activeGame && !game) {
                game = new Game({
                    isRunning: true,
                    isComplete: false,
                    timeRunning: 0,
                });
                await game.save();
                const currentUser =
                    await User.findByEmail(socket.request.user.email);
                currentUser.activeGame = game.id;
                socket.request.user.activeGame = game;
                await currentUser.save();
                games[game.id] = {game, time: game.timeRunning};
                console.log('Game started');
            }
        });

        socket.on('game_end', async () => {
            console.log('Received request to end game');
            if (socket.has_auth && socket.request.user.activeGame && game) {
                game.isRunning = false;
                game.isComplete = true;
                socket.request.user.activeGame = null;
                game = await game.save();

                let curUser =
                    await User.findByEmail(socket.request.user.email);
                curUser.activeGame = null;
                curUser.finishedGames.push(game);
                curUser = await curUser.save();
                delete games[game.id];
                game = null;
                console.log('Ended game');
            }
        });

        socket.on('disconnect', async () => {
            if (socket.request.user.logged_in) {
                if (users.hasOwnProperty(socket.request.user.email)) {
                    delete users[socket.request.user.email];
                }
                if (game && socket.request.user.activeGame) {
                    const gameState = games[game.id];
                    const gameDoc = await Game.findById(game.id);
                    gameDoc.timeRunning = gameState.time;
                    gameDoc.isRunning = false;
                    await gameDoc.save();
                    delete games[game.id];
                    game = null;
                }
                console.log(users);
            } else {
                console.log('Non-authed user disconnected with session ID',
                    socket.request.sessionID);
            }
        });
    });
};
