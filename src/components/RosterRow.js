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
                <td>
                    <div>
                        <p style={{margin:'0px'}}>{this.props.obj.lastname}, {this.props.obj.firstname}</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>{this.props.obj.position} - {this.props.obj.team}</p>
                    </div>
                </td>
                <td style={{textAlign:"right"}}>
                    <div>
                        <p style={{margin:'0px'}}>@ HOU</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>Sun 8:30</p>
                    </div>
                </td>
                <td style={{textAlign:"right"}}>
                    <div>
                        <p style={{margin:'0px'}}>{this.props.obj.shares}</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>${this.props.obj.totalvalue / 100}</p>
                    </div>
                </td>
            </tr>
    );
  }
}

export default RosterRow;