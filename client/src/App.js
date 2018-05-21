import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: openSocket('http://localhost:5000'),
    };

    let self = this;
    this.state.socket.on('auth', (auth) => {
      self.setState({...self.state, auth});
    });
  }

  render() {
    if (this.state.auth) {
      console.log(this.state.auth);
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
