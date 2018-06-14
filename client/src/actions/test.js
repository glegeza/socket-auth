import axios from 'axios';
import * as actions from './types';

export const testUpdate = (socket) => (dispatch) => {
    socket.emit('update');
    dispatch({type: actions.TEST_FAKE_UPDATE});
};
