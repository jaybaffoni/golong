import React, { Component } from 'react';
import { Button, Input, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import queryString from 'qs'
import MyLeagueRow from './MyLeagueRow'

class Leagues extends Component {
    
    constructor(props){
        super(props);
        this.state = {leagues:[], loading:true, userid:localStorage.getItem("uid"), modal:false,
                      name:'', password:'', confirm:''};

        this.joinClicked = this.joinClicked.bind(this);
        this.createClicked = this.createClicked.bind(this);
        this.getLeagues = this.getLeagues.bind(this);
        this.setLeague = this.setLeague.bind(this);
        this.confirmCreate = this.confirmCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.getLeagues();
        
    }

    setLeague(e){
        console.log('test');
        console.log(e);
        this.props.callback(e);
        this.props.history.push('/home');
    }

    getLeagues(){     
        var data = {
            userid: this.state.userid
        }

        axios.post('https://go-long-ff.herokuapp.com/v1/entries', queryString.stringify(data))
            .then((response) => {
                this.setState({loading:false, leagues:response.data});
            })
            .catch((error) => {
                console.log(error);
            }); 
    }
    
    getRows(){
        return this.state.leagues.map((object, i) => {
            return(
                    <MyLeagueRow key={i} obj={object} callback={this.setLeague}/>
                )
            
        })
    }

    joinClicked(){
        this.props.history.push("/join");
    }

    createClicked(){
        this.setState({modal:true});
    }

    confirmCreate(){

        if(this.state.password !== this.state.confirm){
            console.log("passwords don't match");
            return;
        }

        this.setState({modal:false});

        var data = {
            userid: this.state.userid,
            name: this.state.name,
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
                <MDBContainer>
                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                    <MDBModalHeader toggle={this.toggle}>Create New League</MDBModalHeader>
                    <MDBModalBody>
                        <Input label="Enter league name" group name="name" onChange={this.handleChange} validate value={this.state.name}/>
                        <Input label="Enter a password (optional)" group type="password" name="password" onChange={this.handleChange} validate value={this.state.password}/>
                        <Input label="Confirm your password" group type="password" name="confirm" onChange={this.handleChange} validate value={this.state.confirm}/>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="elegant" onClick={this.toggle}>Close</MDBBtn>
                        <MDBBtn color="primary" onClick={this.confirmCreate}>Create</MDBBtn>
                    </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <h1 className="white-text">My Leagues</h1>
                {(!this.state.loading && this.state.leagues.length === 0) && <p className="white-text">You aren't part of any leagues</p>}
                {this.state.loading && <p className="white-text">Loading...</p>}
                {this.getRows()}
                <div  display="inline-block">
                    <Button color="primary" onClick={this.joinClicked} style={{float:"right"}}>Join League</Button> 
                    <Button color="primary" onClick={this.createClicked} style={{float:"right"}}>Create League</Button> 
                </div>
            </div>
    );
  }
}

export default Leagues;