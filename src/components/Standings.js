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
                    // <PlayerRow key={i} obj={object} callback={this.buy}/>
                    <tr key={i}>
                        <td>{object.displayname}</td>
                        <td>{object.cash}</td>
                        <td>{object.sharevalue}</td>
                    </tr>
                )
            
        })
    }
    
    render() {
        return (
            <div>
                {this.state.loading ? <Loader /> : (<div>
                    
                <table style={{marginBottom:'0px'}} className="table table-dark table-hover table-condensed">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Cash</td>
                            <td>Share Value</td>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {this.getRows()}
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