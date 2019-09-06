import React, { Component } from 'react';
import { Button, Input, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import PlayerRow from './PlayerRow';
import queryString from 'qs';

class PlayerSelect extends Component {
    
    constructor(props){
        super(props);
        this.state = { userid: props.user.userid, players:[], page:0, modal:false, selectedPlayer:{}, shares: ''};
        this.getPlayers = this.getPlayers.bind(this);
        this.getRows = this.getRows.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.buy = this.buy.bind(this);
        this.confirmBuy = this.confirmBuy.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.back = this.back.bind(this);

        this.getPlayers(0);
    }

    prev(){
        var page = this.state.page;
        console.log(page);
        if(this.state.page > 0){
            page = page - 1;
            this.getPlayers(page);
            this.setState({page:page});
        }
    }

    next(){
        var page = this.state.page;
        console.log(page);
        page = page + 1;
        this.getPlayers(page);
        this.setState({page:page});
    }

    buy(obj){
        this.setState({selectedPlayer:obj, modal:true});
    }

    getPlayers(page){     
        console.log(page);                 
        axios.get('https://go-long-ff.herokuapp.com/v1/players/' + page)
          .then((response) => {
                this.setState({players: response.data});
            })
          .catch((error) => {
            console.log(error);
          });
    }
    
    getRows(){
        return this.state.players.map((object, i) => {
            return(
                    <PlayerRow key={i} obj={object} callback={this.buy}/>
                )
            
        })
    }

    confirmBuy(){

        this.setState({modal: false});

        if(this.state.shares <= 0){
            console.log('invalid shares amt');
            return;
        }

        var data = {
            userid: this.state.userid,
            playerid: this.state.selectedPlayer.playerid,
            leagueid: this.props.league.leagueid,
            entryid: this.props.league.entryid,
            shares: this.state.shares
        }

        console.log(data);

        axios.post('https://go-long-ff.herokuapp.com/v1/share/buy', queryString.stringify(data))
            .then((response) => {
                this.setState({shares:''});

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

    back(){
        this.props.history.push('/home');
    }
    
    render() {
        return (
            <div>
                <MDBContainer>
                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                    <MDBModalHeader toggle={this.toggle}>{this.state.selectedPlayer.firstname} {this.state.selectedPlayer.lastname}</MDBModalHeader>
                    <MDBModalBody>
                        <h5>Price per share: {this.state.selectedPlayer.price}</h5>
                        <Input label="Number of shares" group name="shares" onChange={this.handleChange} validate value={this.state.shares}/>
                        <h5>Total Cost: {(this.state.selectedPlayer.price * this.state.shares).toFixed(2)}</h5>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="elegant" onClick={this.toggle}>Close</MDBBtn>
                        <MDBBtn color="primary" onClick={this.confirmBuy}>Buy</MDBBtn>
                    </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <div>
                    <h3  style={{display:'inline-block'}}className="white-text">Cash: ${this.state.cash}</h3>
                    <Button  style={{display:'inline-block', float:'right'}}color="primary" size="sm" onClick={this.back}>Portfolio</Button>
                </div>
                <table style={{width:"100%"}}>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th style={{textAlign:"right"}}>Position</th> 
                            <th style={{textAlign:"right"}}>Team</th>
                            <th style={{textAlign:"right"}}>Price</th>
                            <th></th>
                        </tr>
                        {this.getRows()}
                    </tbody>
                </table>
                <div display="inline-block">
                    <Button color="primary" onClick={this.next} style={{float:"right"}}>Next Page</Button> 
                    <Button color="primary" onClick={this.prev} style={{float:"right"}}>Prev Page</Button> 
                </div>
            </div>
    );
  }
}

export default PlayerSelect;