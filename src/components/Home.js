import React, { Component } from 'react';
import Roster from './Roster';

class Home extends Component {
    
    constructor(props){
        super(props);
        this.state = {user:props.user, name: '', isOpen:false};
        this.addPlayers = this.addPlayers.bind(this);
        this.selectLeague = this.selectLeague.bind(this);
    }

    addPlayers(){
        this.props.history.push('/add');
    }

    selectLeague(){
        this.props.history.push('/leagues');
    }
    
    render() {
        return (
            <div>
                <Roster callback={this.addPlayers} league={this.props.league} user={this.state.user} selectLeague={this.selectLeague}/>
                
            </div>
    );
  }
}

export default Home;