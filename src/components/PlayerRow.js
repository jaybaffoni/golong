import React, { Component } from 'react';
var { DateTime } = require('luxon');

class PlayerRow extends Component {
    
    constructor(props){
        super(props);
        this.buy = this.buy.bind(this);

        var d = DateTime.fromISO(props.obj.gametime).toFormat("EEE h':'mm");
        this.state={time:d};

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
                <td style={{textAlign:"right"}}>
                    <div>
                        <p style={{margin:'0px'}}>{this.props.obj.team === this.props.obj.hometeam ? ('vs ' + this.props.obj.awayteam) : ('@ ' + this.props.obj.hometeam)}</p>
                        <p style={{color:'#cccccc',fontSize:'12px',margin:'0px'}}>{this.state.time}</p>
                    </div>
                </td>
                <td style={{textAlign:"right"}}>
                    <div>
                        <p style={{margin:'0px'}}>{this.props.obj.price}</p>
                        {this.props.obj.gameHasBegun ? <p style={{color:'#dd5555',fontSize:'12px',margin:'0px'}}>LOCKED</p> : <p style={{color:'#55dd55',fontSize:'12px',margin:'0px'}}>AVAILABLE</p>}
                    </div>
                </td>
            </tr>
    );
  }
}

export default PlayerRow;