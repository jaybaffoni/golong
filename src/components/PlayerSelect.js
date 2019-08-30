import React, { Component } from 'react';
import { Button } from 'mdbreact';
import axios from 'axios';

class PlayerSelect extends Component {
    
    constructor(props){
        super(props);
        this.state = { players:[], page:0};
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
                        <td style={{textAlign:"right"}}>{object.price}</td>
                    </tr>
                )
            
        })
    }
    
    render() {
        return (
            <div className='row'>
                <div className='col-md-6'>
                    <h1 className="header-text">Available Players</h1>
                    <table style={{width:"100%"}}>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Position</th> 
                                <th>Team</th>
                                <th style={{textAlign:"right"}}>Price</th>
                            </tr>
                            {this.getRows()}
                        </tbody>
                    </table>
                    <div display="inline-block">
                        <Button color="primary" onClick={this.prev}>Prev Page</Button> 
                        <Button color="primary" onClick={this.next} style={{float:"right"}}>Next Page</Button> 
                    </div>
                </div>
                <div className='col-md-6'>
                <h1 className="header-text">My Players</h1>
                </div>
                
            </div>
    );
  }
}

export default PlayerSelect;