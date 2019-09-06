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
      user: JSON.parse(localStorage.getItem('user')),
      collapse: false,
      isWideEnough: false,
      loading: true,
      league: JSON.parse(localStorage.getItem('league')),
      leagues:[],
      modal:false,
      newLeagueName:'',
      newLeaguePassword:'',
      newLeagueConfirm:''
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

  createClicked(){
    this.setState({modal:true});
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
                            <Dropdown>
                              <DropdownToggle nav caret>
                                <span className="mr-2">{!this.state.league ? 'Select League' : this.state.league.leaguename}</span>
                              </DropdownToggle>
                              <DropdownMenu>
                                {this.showLeagues()}
                                <DropdownItem>
                                    <NavLink style={{color:'black'}} to="/join">Join League</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink onClick={this.createClicked} style={{color:'black'}} to="#">Create League</NavLink>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/leagues">Dashboard</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/">Standings</NavLink>
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
            <div style={{paddingTop:"75px", paddingRight:'10px', paddingLeft:'10px'}}>
                <Switch>
                    <PrivateRoute path="/leagues" component={Leagues} callback={this.setLeague} league={this.state.league} getLeagues={this.getLeagues}/>
                    <PrivateRoute path="/home" component={Home} league={this.state.league}/>
                    <PrivateRoute path="/add" component={PlayerSelect} league={this.state.league}/>
                    <PrivateRoute path="/join" component={JoinLeague} league={this.state.league} callback={this.getLeagues} setLeague={this.setLeague}/>
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