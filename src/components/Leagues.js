import React, { Component } from 'react';

class Leagues extends Component {
    
    constructor(props){
        super(props);
        this.state = {Leagues:[]};
    }

    
    render() {
        return (
            <div>
                <h1 className="header-text">Leagues</h1>
            </div>
    );
  }
}

export default Leagues;