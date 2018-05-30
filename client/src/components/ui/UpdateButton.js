import React from 'react';

const updateButton = ({socket, action}) => {
    return (
        <button onClick={() => action(socket)}>Update!</button>
    );
};

export default updateButton;
