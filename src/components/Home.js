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
        this.getPlayers = this.getPlayers.bind(this);
        this.getRows = this.getRows.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);

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

    logout() {
        fire.auth().signOut();
    }

    getPlayers(page){     
        console.log(page);                 
        axios.get('https://go-long-ff.herokuapp.com/v1/players/' + page)
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
                    <tr key={i}>
                        <td>{object.lastname}, {object.firstname}</td>
                        <td>{object.position}</td>
                        <td>{object.team}</td>
                        <td>{object.price}</td>
                    </tr>
                )
            
        })
    }
    
    render() {
        return (
            <div>
                <h1 className="white-text">Welcome {this.state.user}</h1>
                <Button color="primary" onClick={this.logout}>Sign Out</Button> 

                <table style={{width:"100%"}}>
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
                <div style={{width:"100%"}} display="inline-block">
                    <Button color="primary" onClick={this.prev}>Prev Page</Button> 
                    <Button color="primary" onClick={this.next} style={{float:"right"}}>Next Page</Button> 
                </div>
                
                
            </div>
    );
  }
}

export default Home;