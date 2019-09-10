import React, { Component } from 'react';
import { Button, Input, MDBInput, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import PlayerRow from './PlayerRow';
import queryString from 'qs';
import Loader from './Loader';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
var { DateTime } = require('luxon');

class PlayerSelect extends Component {
    
    constructor(props){
        super(props);
        if(!props.league){
            props.history.push('leagues');
        }
        this.state = { loading:true, userid: props.user.userid, players:[], page:0, modal:false, selectedPlayer:{}, playerData:[], tickValues:[], shares: '', position:'', locked:'available'};
        this.getPlayers = this.getPlayers.bind(this);
        this.getRows = this.getRows.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.buy = this.buy.bind(this);
        this.confirmBuy = this.confirmBuy.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clicked = this.clicked.bind(this);
        this.getPlayerData = this.getPlayerData.bind(this);
        this.check = this.check.bind(this);
    }

    componentDidMount(){
        this.getPlayers(0, '', 'available');
    }

    check(checkbox) {
        console.log(checkbox.target.checked);
        if(checkbox.target.checked){
            this.setState({locked:'all'});
            this.getPlayers(0, this.state.position, 'all');
        } else {
            this.setState({locked:'available'});
            this.getPlayers(0, this.state.position, 'available');
        }
        
    }

    prev(){
        var page = this.state.page;
        console.log(page);
        if(this.state.page > 0){
            page = page - 1;
            this.getPlayers(page, this.state.position, this.state.locked);
            this.setState({page:page});
        }
    }

    next(){
        var page = this.state.page;
        console.log(page);
        page = page + 1;
        this.getPlayers(page, this.state.position, this.state.locked);
        this.setState({page:page});
    }

    buy(obj){
        this.getPlayerData(obj.playerid);
        this.setState({selectedPlayer:obj, modal:true});
    }

    getPlayers(page, pos, locked){
        this.setState({loading:true});  
        var url = 'https://go-long-ff.herokuapp.com/v1/players/' + page + '/'+ locked + '/' + pos;
        console.log(url);
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

    getPlayerData(id){
        console.log(id);
        var url = 'https://go-long-ff.herokuapp.com/v1/player/' + id;
        axios.get(url)
          .then((response) => {
                var newData = [];
                var newTicks = [];
                for(var i = 0; i < response.data.length; i++){
                    var datum = response.data[i];
                    var newDatum = {week: datum.week, score: parseFloat(datum.score)};
                    newData.push(newDatum);
                    var newTick = datum.week;
                    newTicks.push(newTick);
                }
                this.setState({playerData:newData, tickValues:newTicks});
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
        this.getPlayers(0, pos, this.state.locked);
    }

    
    
    render() {
        var d = DateTime.fromISO(this.state.selectedPlayer.gametime).toFormat("EEE h':'mm");
        return (
            <div>
                <MDBContainer>
                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                    <MDBModalHeader toggle={this.toggle}>
                        {this.state.selectedPlayer.firstname} {this.state.selectedPlayer.lastname} - {this.state.selectedPlayer.position} {this.state.selectedPlayer.team}
                    </MDBModalHeader>
                    <MDBModalBody>
                        <h5>{d} {this.state.selectedPlayer.team === this.state.selectedPlayer.hometeam ? ('vs ' + this.state.selectedPlayer.awayteam) : ('@ ' + this.state.selectedPlayer.hometeam)}</h5>
                        <h5>Price per share: {this.state.selectedPlayer.price}</h5>
                        <VictoryChart theme={VictoryTheme.material} minDomain={{ y: 0 }}>
                            <VictoryAxis
                            // tickValues specifies both the number of ticks and where
                            // they are placed on the axis
                            tickValues={this.state.tickValues}
                            />
                            <VictoryAxis
                            dependentAxis
                            // tickFormat specifies how ticks should be displayed
                            tickFormat={(x) => (`$${x}`)}
                            />
                            <VictoryLine
                                data={this.state.playerData}
                                // data accessor for x values
                                x="week"
                                // data accessor for y values
                                y="score"
                            />
                        </VictoryChart>
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
                    <div style={{padding:'15px'}}>
                        <p className="white-text" style={{marginRight:'10px', marginBottom:'0px', display:'inline-block'}}>Position: </p>
                        <select style={{display:'inline-block'}} onChange={this.clicked} value={this.state.position}>
                            <option value="">All</option>
                            <option value="QB">QB</option>
                            <option value="RB">RB</option>
                            <option value="WR">WR</option>
                            <option value="TE">TE</option>
                        </select>
                        <input style={{display:'inline-block', width:'25px', height:'25px', float:'right'}} type="checkbox" checked={this.state.locked === 'all'} onChange={this.check}/>
                        <p className="white-text" style={{marginRight:'10px', marginBottom:'0px', display:'inline-block', float:'right'}}>Locked Players: </p>
                    </div>
                <table style={{marginBottom:'0px'}} className="table table-dark table-hover table-condensed">
                    <tbody>
                        {this.getRows()}
                    </tbody>
                </table>
                <div>
                    <Button size="sm" display="inline-block" color="primary" onClick={this.prev} style={{float:"left"}}>Prev</Button> 
                    <Button size="sm" display="inline-block" color="primary" onClick={this.next} style={{float:"right"}}>Next</Button> 
                </div></div>)}
            </div>
    );
  }
}

export default PlayerSelect;