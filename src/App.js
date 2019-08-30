import React, { Component } from 'react';
import './App.css';
import Auth from './Auth';
import Home from './components/Home';
import Leagues from './components/Leagues';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, NavbarNav, NavItem, NavLink,
         Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'mdbreact';
import fire from './Fire';
import axios from 'axios';
import queryString from 'qs'

class App extends Component {
  constructor() {
    super();
    this.state = ({
      user: localStorage.getItem('user'),
      collapse: false,
      isWideEnough: false,
      loading: true
    });
    this.onClick = this.onClick.bind(this);
    this.authListener = this.authListener.bind(this);
    this.setUserState = this.setUserState.bind(this);
    this.logout = this.logout.bind(this);
  }

  onClick(){
      this.setState({
          collapse: !this.state.collapse,
      });
  }

  componentDidMount() {
    this.authListener();
  }

authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
          //create or update user in db
          var display = user.displayName;
          if(!display){
            display = '';
          }
          var data = {
              userid: user.uid,
              email: user.email,
              name: display
          }

          console.log(data);

          axios.post('https://go-long-ff.herokuapp.com/v1/user', queryString.stringify(data))
            .then((response) => {
                console.log(response);
                this.setUserState(response.data);

            })
            .catch((error) => {
                console.log(error);
            });        
      } else {
        console.log('no user');
        localStorage.removeItem('user');
        localStorage.removeItem('uid');
        localStorage.removeItem('uemail');
        localStorage.removeItem('udisplayname');
        this.setState({user:null})
      }
    });
  }

  setUserState(user){
      localStorage.setItem('user', user);
      localStorage.setItem('uid', user.userid);
      localStorage.setItem('uemail', user.email);
      localStorage.setItem('udisplayname', user.name);
      if(user.name === ''){
          user.name = user.email;
      }
      this.setState({ user: user, loading:false});
  }

  logout() {
      fire.auth().signOut();
  }

  render() {
    return (
      <div>
        {this.state.user ? (
        <BrowserRouter>
            { this.state.loading ? <p>LOADING</p> : 
            <div>
            <Navbar fixed="top" color="primary-color" dark expand="md" >
                <NavbarBrand href="/">
                    <strong>Go Long</strong>
                </NavbarBrand>
                { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                <Collapse isOpen = { this.state.collapse } navbar>
                    
                    <NavbarNav right>
                      
                      <NavbarNav right>
                        <NavItem>
                            <NavLink to="/home">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/leagues">Leagues</NavLink>
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                              <DropdownToggle nav caret>
                                <span className="mr-2">{this.state.user.name}</span>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={this.logout}>Log Out</DropdownItem>
                                <DropdownItem >Profile</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                      </NavbarNav>
                    </NavbarNav>
                </Collapse>
            </Navbar>
            <div style={{paddingTop:"75px"}}>
                <Switch>
                    <PrivateRoute path="/home" component={Home}/>
                    <PrivateRoute path="/leagues" component={Leagues}/>
                    <Route path="*" render={() => <Redirect to="/home" />} />
                </Switch>
            </div>
          </div>}
        </BrowserRouter>) :
        (<Auth />)}
        
      </div>
    )}
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('uid') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin"
          }}
        />
      )
    }
  />
);

 export default App;