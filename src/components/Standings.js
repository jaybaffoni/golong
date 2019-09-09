import React, { Component } from 'react';
import { Button } from 'mdbreact';
import axios from 'axios';
import PlayerRow from './PlayerRow';
import queryString from 'qs';
import Loader from './Loader';

class Standings extends Component {
    
    constructor(props){
        super(props);
        if(!props.league){
            props.history.push('leagues');
        }
        this.state = { loading:true, userid: props.user.userid, users:[]};
        this.getStandings = this.getStandings.bind(this);
        this.getRows = this.getRows.bind(this);
    }

    componentDidMount(){
        this.getStandings();
    }


    getStandings(){

        this.setState({loading:true})

        var data = {
            leagueid: this.props.league.leagueid,
        }

        axios.post('https://go-long-ff.herokuapp.com/v1/standings', queryString.stringify(data))
            .then((response) => {
                console.log(response.data);
                this.setState({loading:false, users:response.data});
            })
            .catch((error) => {
                console.log(error);
            });   
    }
    
    getRows(){
        return this.state.users.map((object, i) => {
            return(
                    <PlayerRow key={i} obj={object} callback={this.buy}/>
                )
            
        })
    }
    
    render() {
        return (
            <div>
                {this.state.loading ? <Loader /> : (<div>
                    <div style={{padding:'15px'}}>
                        <p className="white-text" style={{marginRight:'10px', marginBottom:'0px', display:'inline-block'}}>Position: </p>
                        <select style={{display:'inline-block'}} onChange={this.clicked} value={this.state.position}>
                            <option value="">All</option>
                            <option value="QB">QB</option>
                            <option value="RB">RB</option>
                            <option value="WR">WR</option>
                            <option value="TE">TE</option>
                        </select>
                    </div>
                <table style={{marginBottom:'0px'}} className="table table-dark table-hover table-condensed">
                    <tbody>
                        {/* {this.getRows()} */}
                    </tbody>
                </table>
                <div>
                    <Button size="sm" display="inline-block" color="primary" onClick={this.prev} style={{float:"left"}}>Prev</Button> 
                    <Button size="sm" display="inline-block" color="primary" onClick={this.next} style={{float:"right"}}>Next</Button> 
                </div></div>)}
            </div>
    );
  }
}

export default Standings;