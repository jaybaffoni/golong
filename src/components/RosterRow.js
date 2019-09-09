import React, { Component } from 'react';
var { DateTime } = require('luxon');

class RosterRow extends Component {
    
    constructor(props){
        super(props);
        this.sell = this.sell.bind(this);

        var d = DateTime.fromISO(props.obj.gametime).toFormat("EEE h':'mm");
        this.state={time:d};
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
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>{this.props.obj.position} {this.props.obj.team}</p>
                    </div>
                </td>
                <td style={{textAlign:"right"}}>
                    <div>
                        <p style={{margin:'0px'}}>{this.props.obj.team === this.props.obj.hometeam ? ('vs ' + this.props.obj.awayteam) : ('@ ' + this.props.obj.hometeam)}</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>{this.state.time}</p>
                    </div>
                </td>
                <td style={{textAlign:"right"}}>
                    <div>
                        <p style={{margin:'0px'}}>${(this.props.obj.shares * this.props.obj.price).toFixed(2)}</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>{this.props.obj.shares} share{this.props.obj.shares !== 1 && 's'}</p>
                    </div>
                </td>
            </tr>
    );
  }
}

export default RosterRow;