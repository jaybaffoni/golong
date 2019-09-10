import React, { Component } from 'react';
import { Input, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import queryString from 'qs';
import RosterRow from './RosterRow';
import Loader from './Loader';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
var { DateTime } = require('luxon');

class Roster extends Component {
    
    constructor(props){
        super(props);
        if(!props.league){
            props.selectLeague();
        }
        this.state = {loading:true, update:false, league:props.league, cash:null, players: [], userid: props.user.userid, selectedPlayer:{}, playerData:[], tickValues:[], shares:''};
        this.addPlayers = this.addPlayers.bind(this);
        this.sell = this.sell.bind(this);
        this.confirmSell = this.confirmSell.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getPlayerData = this.getPlayerData.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.league.leagueid !== state.league.leagueid) {
          return {
            league:props.league,
            update:true
          };
        }
        return null;
      }

    sell(obj){
        this.getPlayerData(obj.playerid);
        this.setState({selectedPlayer:obj, modal:true});
    }

    confirmSell(){

        if(this.state.shares > this.state.selectedPlayer.shares){
            console.log('invalid shares amt');
            return;
        }

        this.setState({modal: false});

        var data = {
            userid: this.state.userid,
            playerid: this.state.selectedPlayer.playerid,
            leagueid: this.state.league.leagueid,
            entryid: this.state.league.entryid,
            shares: this.state.shares
        }

        console.log(data);

        axios.post('https://go-long-ff.herokuapp.com/v1/share/sell', queryString.stringify(data))
            .then((response) => {
                this.getRoster();

            })
            .catch((error) => {
                console.log(error);
            });   
    }

    componentDidMount(){
        this.getRoster();
    }

    addPlayers(){
        this.props.callback();
    }

    getRoster(){                   
        this.setState({loading:true}); 
        var data = {
            userid: this.state.userid,
            entryid: this.state.league.entryid
        }

        axios.post('https://go-long-ff.herokuapp.com/v1/shares', queryString.stringify(data))
            .then((response) => {
                console.log(response);
                var cash = null;
                var newPlayers = [];
                for(var i = 0; i < response.data.length; i++){
                    if(response.data[i].playerid){
                        newPlayers.push(response.data[i]);
                    } else {
                        cash = response.data[0].cash / 100;
                    }
                }
                setTimeout(function () {
                    this.setState({loading:false, update:false, cash:cash, players:newPlayers});
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
                    var newDatum = {week: i+1, score: parseFloat(datum.score)};
                    newData.push(newDatum);
                    var newTick = datum.week;
                    newTicks.push("Week " + newTick);
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
                    <RosterRow key={i} obj={object} callback={this.sell}/>
                )
            
        })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }

      toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
      }
    
    render() {
        if(this.state.update){
            this.getRoster();
        }
        var d = DateTime.fromISO(this.state.selectedPlayer.gametime).toFormat("EEE h':'mm");
        return (
            <div >
                <MDBContainer>
                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                    <MDBModalHeader toggle={this.toggle}>
                        {this.state.selectedPlayer.firstname} {this.state.selectedPlayer.lastname} - {this.state.selectedPlayer.position} {this.state.selectedPlayer.team}
                    </MDBModalHeader>
                    <MDBModalBody>
                        <h5>{d} {this.state.selectedPlayer.team === this.state.selectedPlayer.hometeam ? ('vs ' + this.state.selectedPlayer.awayteam) : ('@ ' + this.state.selectedPlayer.hometeam)}</h5>
                        <h5>Current Shares: {this.state.selectedPlayer.shares}</h5>
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
                        <h5>Shares Left: {this.state.selectedPlayer.shares - this.state.shares}</h5>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="elegant" onClick={this.toggle}>Close</MDBBtn>
                        <MDBBtn color="danger" onClick={this.confirmSell}>Sell</MDBBtn>
                    </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                {this.state.loading ? <Loader /> : (
                <table className="table table-dark table-hover table-condensed">
                    <tbody>
                        {this.getRows()}
                    </tbody>
                </table>)}
            </div>
    );
  }
}

export default Roster;