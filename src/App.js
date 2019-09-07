import React, { Component } from 'react';
import './App.css';
import Auth from './Auth';
import Home from './components/Home';
import Leagues from './components/Leagues';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Input,
         Navbar, NavbarBrand, NavbarToggler, Collapse, NavbarNav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, DropdownToggle,
         MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
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
      collapse: false,
      isWideEnough: false,
      loading: true,
      league: null,
      leagues:[],
      modal:false,
      newLeagueName:'',
      newLeaguePassword:'',
      newLeagueConfirm:'',
      user: fire.auth().currentUser
    });
    this.onClick = this.onClick.bind(this);
    this.authListener = this.authListener.bind(this);
    this.setUserState = this.setUserState.bind(this);
    this.logout = this.logout.bind(this);
    this.setLeague = this.setLeague.bind(this);
    this.getLeagues = this.getLeagues.bind(this);
    this.createClicked = this.createClicked.bind(this);
    this.confirmCreate = this.confirmCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    console.log(fire.auth().currentUser);

  }

  getLeagues(){

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
      this.setState({league:league, collapse:false});
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
        this.setState({user:null})
      }
    });
  }

  setUserState(user){
      if(user.name === ''){
          user.name = user.email;
      }
      this.setState({ user: user, loading:false});
  }

  logout() {
      fire.auth().signOut();
  }

  createClicked(){
    this.setState({modal:true});
    this.closeMenu();
}

confirmCreate(){

    if(this.state.newLeaguePassword !== this.state.newLeagueConfirm){
        console.log("passwords don't match");
        return;
    }

    this.setState({modal:false});

    var data = {
        userid: this.state.user.userid,
        name: this.state.newLeagueName,
        // password: this.state.password
    }

    axios.post('https://go-long-ff.herokuapp.com/v1/league', queryString.stringify(data))
        .then((response) => {
            this.getLeagues();

        })
        .catch((error) => {
            console.log(error);
        });   
}

toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  closeMenu = () => {
    console.log('trying to close');
    this.setState({collapse:false});
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
                            <NavLink onClick={this.closeMenu} to="/leagues">Dashboard</NavLink>
                        </NavItem>
                        <NavItem>
                            <Dropdown>
                              <DropdownToggle nav caret>
                                <span className="mr-2">{!this.state.league ? 'Select League' : this.state.league.leaguename}</span>
                              </DropdownToggle>
                              <DropdownMenu>
                                {this.showLeagues()}
                                <DropdownItem>
                                    <NavLink onClick={this.closeMenu} style={{color:'black'}} to="/join">Join League</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink onClick={this.createClicked} style={{color:'black'}} to="#">Create League</NavLink>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={this.closeMenu} to="/home">Portfolio</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={this.closeMenu} to="/add">Players</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={this.closeMenu} to="/">Standings</NavLink>
                        </NavItem>
                        {/* <NavItem>
                            {this.state.cash && <NavLink to="/add">Cash: {this.state.cash}</NavLink>}
                        </NavItem> */}
                    </NavbarNav>
                </Collapse>
            </Navbar>
            <MDBContainer>
                <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                <MDBModalHeader toggle={this.toggle}>Create New League</MDBModalHeader>
                <MDBModalBody>
                    <Input label="Enter league name" group name="newLeagueName" onChange={this.handleChange} validate value={this.state.newLeagueName}/>
                    <Input label="Enter a password (optional)" group type="password" name="newLeaguePassword" onChange={this.handleChange} validate value={this.state.newLeaguePassword}/>
                    <Input label="Confirm your password" group type="password" name="newLeagueConfirm" onChange={this.handleChange} validate value={this.state.newLeagueConfirm}/>
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="elegant" onClick={this.toggle}>Close</MDBBtn>
                    <MDBBtn color="primary" onClick={this.confirmCreate}>Create</MDBBtn>
                </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
            <div style={{paddingTop:"50px"}}>
                <Switch>
                    <PrivateRoute path="/leagues" component={Leagues} user={this.state.user} callback={this.setLeague} league={this.state.league} getLeagues={this.getLeagues}/>
                    <LeagueRoute path="/home" component={Home} object={this.state.league} league={this.state.league} user={this.state.user}/>
                    <LeagueRoute path="/add" component={PlayerSelect}  object={this.state.league} user={this.state.user} league={this.state.league}/>
                    <PrivateRoute path="/join" component={JoinLeague} user={this.state.user} league={this.state.league} callback={this.getLeagues} setLeague={this.setLeague}/>
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
    fire.auth().currentUser
      ? <Component {...props} {...rest}/>
      : <Redirect to={{
          pathname: '/signin'
        }} />
  )} />
)

const LeagueRoute = ({ component: Component, object: League, ...rest }) => (
  
  <Route {...rest} render={(props) => (
    
    (fire.auth().currentUser && League)
      ? <Component {...props} {...rest}/>
      : <Redirect to={{
          pathname: '/leagues'
        }} />
  )} />
)

 export default App;