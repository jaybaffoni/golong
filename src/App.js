import React, { Component } from 'react';
import './App.css';
import fire from './Fire';
import Auth from './Auth';
import Main from './Main';


class App extends Component {
  constructor() {
    super();
    this.state = ({
      user: null,
    });
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        console.log(user);
        localStorage.setItem('user', user.uid);
        this.setState({ user });
      } else {
        localStorage.removeItem('user');
        this.setState({ user: null });
      }
    });
  }
  render() {
    return (
      <div className="App">
        {this.state.user ? (<Main />) : (<Auth />)}
      </div>
    )}
}

 export default App;