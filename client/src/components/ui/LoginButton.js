import React from 'react';

const loginButton = () => {
    return (
        <form action="/api/auth/google">
            <input type="submit" value="Login" />
        </form>
    );
};

export default loginButton;
