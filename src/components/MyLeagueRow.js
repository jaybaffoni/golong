import React, { Component } from 'react';
import { Button } from 'mdbreact';

class MyLeagueRow extends Component {
    
    constructor(props){
        super(props);
        this.setName = this.setName.bind(this);
        this.leaveLeague = this.leaveLeague.bind(this);
    }

    setName(){
        this.props.callback(this.props.obj);
    }

    leaveLeague(){
        this.props.leave(this.props.obj);
    }
    
    render() {
        return (
            <div className="login-card col-md-6" style={{marginTop:20}}>
                <h3>{this.props.obj.leaguename}</h3>
                <Button color="primary" block onClick={this.setName}>Select</Button>
                <Button color="danger" block onClick={this.leaveLeague}>Leave</Button>
            </div>
    );
  }
}

export default MyLeagueRow;