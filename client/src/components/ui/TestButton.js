import React from 'react';

const updateButton = ({socket, action}) => {
    return (
        <button onClick={() => action(socket)}>Do thing!</button>
    );
};

export default updateButton;
