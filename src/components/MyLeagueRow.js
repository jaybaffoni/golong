import React, { Component } from 'react';
import { Button } from 'mdbreact';

class MyLeagueRow extends Component {
    
    constructor(props){
        super(props);
        this.setName = this.setName.bind(this);
    }

    setName(){
        this.props.callback(this.props.obj);
    }
    
    render() {
        return (
            <div>
                <p className="white-text">{this.props.obj.leaguename}</p>
                <Button size="sm" color="primary" onClick={this.setName}>Select</Button> 
            </div>
    );
  }
}

export default MyLeagueRow;