import axios from 'axios';
import * as actions from './types';

export const resumeGame = (socket) => (dispatch) => {
    socket.emit('game_resume');
    dispatch({type: actions.GAME_RESUME});
};

export const startGame = (socket) => (dispatch) => {
    socket.emit('game_start');
    dispatch({type: actions.GAME_START});
};

export const endGame = (socket) => (dispatch) => {
    socket.emit('game_end');
    dispatch({type: actions.GAME_END});
};
