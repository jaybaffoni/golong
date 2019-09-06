import React, { Component } from 'react';
import './App.css';
import Auth from './Auth';
import Home from './components/Home';
import Leagues from './components/Leagues';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, NavbarNav, NavItem, NavLink,
         Dropdown, DropdownMenu, DropdownToggle } from 'mdbreact';
import fire from './Fire';
import axios from 'axios';
import queryString from 'qs'
import JoinLeague from './components/JoinLeague';
import HomeLeagueRow from './components/HomeLeagueRow';
import PlayerSelect from './components/PlayerSelect';

class App extends Component {
  constructor() {
    super();
    this.state = ({
      user: JSON.parse(localStorage.getItem('user')),
      collapse: false,
      isWideEnough: false,
      loading: true,
      league: JSON.parse(localStorage.getItem('league')),
      leagues:[]
    });
    this.onClick = this.onClick.bind(this);
    this.authListener = this.authListener.bind(this);
    this.setUserState = this.setUserState.bind(this);
    this.logout = this.logout.bind(this);
    this.setLeague = this.setLeague.bind(this);
    this.getLeagues = this.getLeagues.bind(this);

    console.log('user:');
    console.log(this.state.user);
    console.log('league:');
    console.log(this.state.league);
  }

  getLeagues(){

    console.log(this.state.user);

    var data = {
        userid: this.state.user
    }

    axios.post('https://go-long-ff.herokuapp.com/v1/entries', queryString.stringify(data))
        .then((response) => {
            console.log(response);
            this.setState({leagues:response.data});
        })
        .catch((error) => {
            console.log(error);
        }); 
}

  showLeagues(){
    return this.state.leagues.map((object, i) => {
      return(
              <HomeLeagueRow key={i} obj={object} callback={this.setLeague}/>          
          )
      
      })
  }

  setLeague(league){
      console.log(league);
      localStorage.setItem('league', JSON.stringify(league));
      this.setState({league:league});
  }

  onClick(){
      this.setState({
          collapse: !this.state.collapse,
      });
  }

  componentDidMount() {
    this.authListener();
    this.getLeagues();
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

          axios.post('https://go-long-ff.herokuapp.com/v1/user', queryString.stringify(data))
            .then((response) => {
                this.setUserState(response.data);

            })
            .catch((error) => {
                console.log(error);
            });        
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('uid');
        localStorage.removeItem('uemail');
        localStorage.removeItem('udisplayname');
        this.setState({user:null})
      }
    });
  }

  setUserState(user){
      localStorage.setItem('user', JSON.stringify(user));
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
                        <NavItem>
                            <NavLink to="/leagues">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                              <DropdownToggle nav caret>
                                <span className="mr-2">{!this.state.league ? 'Select League' : this.state.league.leaguename}</span>
                              </DropdownToggle>
                              <DropdownMenu>
                                {this.showLeagues()}
                              </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        {/* <NavItem>
                            {this.state.cash && <NavLink to="/add">Cash: {this.state.cash}</NavLink>}
                        </NavItem> */}
                    </NavbarNav>
                </Collapse>
            </Navbar>
            <div style={{paddingTop:"75px", paddingRight:'10px', paddingLeft:'10px'}}>
                <Switch>
                    <PrivateRoute path="/leagues" component={Leagues} callback={this.setLeague}/>
                    <PrivateRoute path="/home" component={Home} league={this.state.league}/>
                    <PrivateRoute path="/add" component={PlayerSelect} league={this.state.league}/>
                    <PrivateRoute path="/join" component={JoinLeague}/>
                    <Route path="*" render={() => <Redirect to="/leagues" />} />
                </Switch>
            </div>
          </div>}
        </BrowserRouter>) :
        (<Auth />)}
        
      </div>
    )}
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('uid')
      ? <Component {...props} {...rest}/>
      : <Redirect to={{
          pathname: '/signin'
        }} />
  )} />
)

 export default App;