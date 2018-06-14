import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import io from 'socket.io-client';

import './App.css';

import UpdateButton from './components/ui/UpdateButton';
import LogoutButton from './components/ui/LogoutButton';
import LoginButton from './components/ui/LoginButton';
import TestButton from './components/ui/TestButton';

import * as actions from './actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('http://localhost:5000'),
    };

    this.state.socket.on('auth', (auth) => {
      console.log('auth');
      this.props.updateAuthStatus(auth);
    });
    this.state.socket.on('no_auth', (session) => {
      console.log('no_auth');
      this.props.updateAuthStatus(false);
    });
  }

  render() {
    let content = <p>Loading...</p>;
    if (this.props.auth !== null) {
      content = [<p key={1}>Ready</p>];
      if (this.props.auth && this.props.auth.logged_in) {
        content.push(<p key={2}>Logged in as {this.props.auth.email}</p>);
        content.push(<LogoutButton
          key={3}
          action={this.props.logoutCurrentUser}
          socket={this.state.socket}
        />);
        content.push(<UpdateButton key={4} socket={this.state.socket} action={this.props.requestAuthStatus} />);
        content.push(<TestButton key={5} socket={this.state.socket} action={this.props.testUpdate} />);
      } else {
        content.push(<p key={2}>Not logged in</p>);
        content.push(<LoginButton key={3} />);
        content.push(<UpdateButton key={4} socket={this.state.socket} action={this.props.requestAuthStatus} />);
      }
    }
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => {
  return {auth};
};

export default withRouter(connect(mapStateToProps, actions)(App));
