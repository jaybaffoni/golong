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
                <td>
                    <div>
                        <p style={{margin:'0px'}}>{this.props.obj.lastname}, {this.props.obj.firstname}</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>{this.props.obj.position} {this.props.obj.team}</p>
                    </div>
                </td>
                <td>
                    <div>
                        <p style={{margin:'0px'}}>@ HOU</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>Sun 8:30</p>
                    </div>
                </td>
                <td style={{textAlign:'right'}}>${this.props.obj.price}</td>
            </tr>
    );
  }
}

export default PlayerRow;