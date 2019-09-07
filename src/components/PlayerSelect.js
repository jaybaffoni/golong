import React, { Component } from 'react';
import { Button, Input, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import PlayerRow from './PlayerRow';
import queryString from 'qs';
import Loader from './Loader';

class PlayerSelect extends Component {
    
    constructor(props){
        super(props);
        if(!props.league){
            props.history.push('leagues');
        }
        this.state = { loading:true, userid: props.user.userid, players:[], page:0, modal:false, selectedPlayer:{}, shares: '', position:''};
        this.getPlayers = this.getPlayers.bind(this);
        this.getRows = this.getRows.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.buy = this.buy.bind(this);
        this.confirmBuy = this.confirmBuy.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clicked = this.clicked.bind(this);
    }

    componentDidMount(){
        this.getPlayers(0, '');
    }

    prev(){
        var page = this.state.page;
        console.log(page);
        if(this.state.page > 0){
            page = page - 1;
            this.getPlayers(page, this.state.position);
            this.setState({page:page});
        }
    }

    next(){
        var page = this.state.page;
        console.log(page);
        page = page + 1;
        this.getPlayers(page, this.state.position);
        this.setState({page:page});
    }

    buy(obj){
        this.setState({selectedPlayer:obj, modal:true});
    }

    getPlayers(page, pos){
        this.setState({loading:true});  
        var url = 'https://go-long-ff.herokuapp.com/v1/players/' + page + '/' + pos;
        axios.get(url)
          .then((response) => {
                setTimeout(function () {
                    this.setState({loading:false, players: response.data});
                    window.scrollTo(0, 0)
                }.bind(this), 500);  
                
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

        axios.post('https://go-long-ff.herokuapp.com/v1/share/buy', queryString.stringify(data))
            .then((response) => {
                this.setState({shares:''});
                this.props.history.push('home');
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

    clicked(e){
        var pos = e.target.value;
        this.setState({position:pos, page:0});
        if(pos === 'All') pos = '';
        this.getPlayers(0, pos);
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
                {this.state.loading ? <Loader /> : (<div>
                <table className="table table-dark table-striped table-hover table-condensed">
                    <thead>
                        <tr>
                        <th scope="col">Name</th>
                        <th scope="col" style={{textAlign:'right'}}>
                            <select onChange={this.clicked} value={this.state.position}>
                                <option value="">All</option>
                                <option value="QB">QB</option>
                                <option value="RB">RB</option>
                                <option value="WR">WR</option>
                                <option value="TE">TE</option>
                            </select>
                        </th>
                        <th scope="col"></th>
                        <th scope="col" style={{textAlign:'right'}}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getRows()}
                    </tbody>
                </table>
                <div>
                    <Button display="inline-block" color="primary" onClick={this.prev} style={{float:"left"}}>Prev Page</Button> 
                    <Button display="inline-block" color="primary" onClick={this.next} style={{float:"right"}}>Next Page</Button> 
                </div></div>)}
            </div>
    );
  }
}

export default PlayerSelect;