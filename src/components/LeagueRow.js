import React, { Component } from 'react';
import { Button } from 'mdbreact';

class LeagueRow extends Component {
    
    constructor(props){
        super(props);
        this.joinLeague = this.joinLeague.bind(this);
        this.leaveLeague = this.leaveLeague.bind(this);
    }

    joinLeague(){
        this.props.joinLeague(this.props.obj.leagueid);
    }

    leaveLeague(){
        this.props.leaveLeague(this.props.obj.leagueid);
    }
    
    render() {
        return (
            <div>
                <p style={{display:"inline-block"}} className="white-text">{this.props.obj.name}</p>
                {this.props.joined ? 
                    <Button style={{display:"inline-block"}} size="sm" color="danger" onClick={this.leaveLeague}>Leave</Button> :
                    <Button style={{display:"inline-block"}} size="sm" color="primary" onClick={this.joinLeague}>Join</Button>
                }
            </div>
    );
  }
}

export default LeagueRow;