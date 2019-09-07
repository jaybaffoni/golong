import React, { Component } from 'react';

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
            <tr className='table-row' onClick={this.buy}>
                <td>{this.props.obj.lastname}, {this.props.obj.firstname}</td>
                <td style={{textAlign:"right"}}>{this.props.obj.position}</td>
                <td style={{textAlign:"right"}}>{this.props.obj.team}</td>
                <td style={{textAlign:'right'}}>${this.props.obj.price}</td>
            </tr>
    );
  }
}

export default PlayerRow;