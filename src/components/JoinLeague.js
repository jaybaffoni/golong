import React, { Component } from 'react';
import axios from 'axios';
import LeagueRow from './LeagueRow';
import queryString from 'qs';

class JoinLeague extends Component {
    
    constructor(props){
        super(props);
        this.state = {leagues:[], myLeagues:{}, loading:true, userid:localStorage.getItem("uid"), name: localStorage.getItem("udisplayname")};

        this.getLeagues = this.getLeagues.bind(this);
        this.getMyLeagues = this.getMyLeagues.bind(this);
        this.join = this.join.bind(this);
        this.leave = this.leave.bind(this);
        
    }

    componentDidMount(){
        this.getLeagues();
    }

    join(id){
        var data = {
            userid: this.state.userid,
            name: this.state.name,
            leagueid: id,
            password:''
        }

        axios.post('https://go-long-ff.herokuapp.com/v1/entry', queryString.stringify(data))
            .then((response) => {
                this.getLeagues();

            })
            .catch((error) => {
                console.log(error);
            });   
    }

    leave(id){
        var data = {
            userid: this.state.userid,
            entryid: this.state.myLeagues[id]['entryid']
        }

        axios.post('https://go-long-ff.herokuapp.com/v1/league/leave', queryString.stringify(data))
            .then((response) => {
                this.getLeagues();

            })
            .catch((error) => {
                console.log(error);
            });   
    }

    getLeagues(){     
        axios.get('https://go-long-ff.herokuapp.com/v1/leagues')
            .then((response) => {
                var leaguesToAdd = {};
                for(var i = 0; i < response.data.length; i++){
                    var item = response.data[i];
                    var idString = item.leagueid + "";
                    var leagueObj = {};
                    leagueObj['joined'] = false;
                    leagueObj['entryid'] = -1;
                    leaguesToAdd[idString] = leagueObj;
                }
                this.setState({loading:false, leagues:response.data, myLeagues:leaguesToAdd});
                this.getMyLeagues();
            })
            .catch((error) => {
                console.log(error);
            }); 
    }

    getMyLeagues(){
        var data = {
            userid: this.state.userid
        }

        axios.post('https://go-long-ff.herokuapp.com/v1/entries', queryString.stringify(data))
            .then((response) => {
                console.log(response);
                var leaguesToAdd = this.state.myLeagues;
                for(var i = 0; i < response.data.length; i++){
                    var item = response.data[i];
                    var idString = item.leagueid + "";
                    var leagueObj = leaguesToAdd[idString];
                    leagueObj['joined'] = true;
                    leagueObj['entryid'] = item.entryid;
                }
                this.setState({myLeagues:leaguesToAdd});
            })
            .catch((error) => {
                console.log(error);
            }); 
    }
    
    getRows(){
        
        return this.state.leagues.map((object, i) => {
            //var object = this.state.games[key]
            var id = object.leagueid;
            return(
                    // <PickRow key={i} obj={object} k={object.game_id} />
                    <LeagueRow key={i} obj={object} joinLeague={this.join} leaveLeague={this.leave} joined={this.state.myLeagues[id + ""]['joined']}/>                 
                )
            
        })
    }
    
    render() {
        return (
            <div>
                <h1 className="white-text">All Leagues</h1>
                {(!this.state.loading && this.state.leagues.length === 0) && <p className="white-text">There aren't any leagues</p>}
                {this.state.loading && <p className="white-text">Loading...</p>}
                {this.getRows()}
            </div>
    );
  }
}

export default JoinLeague;