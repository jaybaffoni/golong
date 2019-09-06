import React, { Component } from 'react';
import { DropdownItem, NavLink } from 'mdbreact';

class HomeLeagueRow extends Component {
    
    constructor(props){
        super(props);
        this.setLeague = this.setLeague.bind(this);
    }

    setLeague(){
        this.props.callback(this.props.obj);
    }
    
    render() {
        return (
            <DropdownItem>
                <NavLink onClick={this.setLeague} style={{color:'black'}} to="/home">{this.props.obj.leaguename}</NavLink>
            </DropdownItem>
    );
  }
}

export default HomeLeagueRow;