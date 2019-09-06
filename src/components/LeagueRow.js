import React, { Component } from 'react';
import { Button } from 'mdbreact';

class LeagueRow extends Component {
    
    constructor(props){
        super(props);
        this.joinLeague = this.joinLeague.bind(this);
    }

    joinLeague(){
        this.props.joinLeague(this.props.obj.leagueid);
    }
    
    render() {
        return (
            <div className="login-card col-md-6" style={{marginTop:20}}>
                <h3>{this.props.obj.name}</h3>
                <Button block color="primary" onClick={this.joinLeague}>Join</Button>
            </div>
    );
  }
}

export default LeagueRow;