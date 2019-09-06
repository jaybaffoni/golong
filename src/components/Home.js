import React, { Component } from 'react';
import Roster from './Roster';

class Home extends Component {
    
    constructor(props){
        super(props);
        this.state = {user:props.user, name: '', isOpen:false};
        this.addPlayers = this.addPlayers.bind(this);
    }

    addPlayers(){
        this.props.history.push('/add');
    }
    
    render() {
        return (
            <div>
                <Roster callback={this.addPlayers} league={this.props.league} user={this.state.user}/>
                
            </div>
    );
  }
}

export default Home;