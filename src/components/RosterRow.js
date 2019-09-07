import React, { Component } from 'react';

class RosterRow extends Component {
    
    constructor(props){
        super(props);
        this.sell = this.sell.bind(this);
    }

    sell(){
        this.props.callback(this.props.obj)
    }
    
    render() {
        return (
            <tr className='table-row' onClick={this.sell}>
                <td>{this.props.obj.lastname}, {this.props.obj.firstname}</td>
                <td style={{textAlign:"right"}}>{this.props.obj.position}</td>
                <td style={{textAlign:"right"}}>{this.props.obj.team}</td>
                <td style={{textAlign:"right"}}>{this.props.obj.shares}</td>
                <td style={{textAlign:'right'}}>${this.props.obj.totalvalue / 100}</td>
            </tr>
    );
  }
}

export default RosterRow;