import React, { Component } from 'react';
import fire from '../Fire';
import { Button } from 'mdbreact';
import axios from 'axios';

class Home extends Component {
    
    constructor(props){
        super(props);
        this.state = {user: localStorage.getItem('user'), name: '', players:[], page:0};
        console.log(this.state.user);
        this.logout = this.logout.bind(this);
        this.supplyName = this.supplyName.bind(this);
        this.getPlayers = this.getPlayers.bind(this);
        this.getRows = this.getRows.bind(this);

        this.getPlayers();
    }

    logout() {
        fire.auth().signOut();
    }

    supplyName(){
        this.setState({name: 'THIS IS A NAME'});
    }

    getPlayers(){                       
        axios.get('https://go-long-ff.herokuapp.com/players/' + this.state.page)
          .then((response) => {
                console.log(response.data);
                this.setState({players: response.data});
            })
          .catch((error) => {
            console.log(error);
          });
    }
    
    getRows(){
        return this.state.players.map((object, i) => {
            //var object = this.state.games[key];
            return(
                    // <PickRow key={i} obj={object} k={object.game_id} />
                    <p key={i} k={object.playerid}>{object.lastname}, {object.firstname}</p>
                )
            
        })
    }
    
    render() {
        return (
            <div>
                <h1 className="white-text">Welcome {this.state.user}</h1>
                <Button color="primary" onClick={this.logout}>Sign Out</Button> 

                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Position</th> 
                            <th>Team</th>
                            <th>Price</th>
                        </tr>
                        {this.getRows()}
                    </tbody>
                </table>
                
            </div>
    );
  }
}

export default Home;