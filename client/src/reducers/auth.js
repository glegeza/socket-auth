import * as actions from '../actions/types';

const reducer = (state=null, action) => {
    switch (action.type) {
        case actions.AUTH_UPDATE_STATUS:
            return action.payload;
        case actions.AUTH_GET_STATUS:
            return null;
        default:
            return state;
    }
};

export default reducer;
