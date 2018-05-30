import React from 'react';

const logoutButton = ({action, socket}) => {
    return (
        <button onClick={() => action(socket)}>Logout!</button>
    );
};

export default logoutButton;
