import React, {Component} from 'react';
import './App.css';
import io from 'socket.io-client';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWaiting: true,
      socket: io('http://localhost:5000'),
    };

    let self = this;
    this.state.socket.on('auth', (auth) => {
      console.log('auth');
      self.setState({...self.state, auth, isWaiting: false});
    });
    this.state.socket.on('no_auth', (session) => {
      console.log('no_auth');
      self.setState({...self.state, auth: null, isWaiting: false});
    });
  }

  async logout() {
    try {
      await axios.delete('api/me/logout');
      this.state.socket.emit('status');
    } catch (err) {
      console.log(err);
    }
  };

  // async componentDidMount() {
  //   try {
  //     await axios.get('api/auth/google');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  render() {
    let content = <p>Loading...</p>;
    if (!this.state.isWaiting) {
      content = [<p key={1}>Ready</p>];
      if (this.state.auth && this.state.auth.logged_in) {
        content.push(<p key={2}>Logged in as {this.state.auth.email}</p>);
        content.push(<button key={3} onClick={() => this.logout()}>Logout!</button>)
      } else {
        content.push(<p key={2}>Not logged in</p>);
      }
    }
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
