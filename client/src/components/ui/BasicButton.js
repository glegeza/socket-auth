import React from 'react';

const basicButton = ({socket, action, text}) => {
    return (
        <button onClick={() => action(socket)}>{text}</button>
    );
};

export default basicButton;
