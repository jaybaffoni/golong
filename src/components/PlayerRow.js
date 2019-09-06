import React, { Component } from 'react';
import { Button } from 'mdbreact';

class PlayerRow extends Component {
    
    constructor(props){
        super(props);
        this.buy = this.buy.bind(this);
    }

    buy(){
        this.props.callback(this.props.obj)
    }
    
    render() {
        return (
            <tr>
                <td>{this.props.obj.lastname}, {this.props.obj.firstname}</td>
                <td style={{textAlign:"right"}}>{this.props.obj.position}</td>
                <td style={{textAlign:"right"}}>{this.props.obj.team}</td>
                <td style={{textAlign:'right'}}>${this.props.obj.price}</td>
                <td><Button size="sm" color="primary" style={{float:'right'}} onClick={this.buy}>Buy</Button></td>
            </tr>
    );
  }
}

export default PlayerRow;