import React, { Component } from 'react';
import PlayerSelect from './PlayerSelect';

class Home extends Component {
    
    constructor(props){
        super(props);
        this.state = {user: localStorage.getItem('user'), name: '', isOpen:false};
        console.log(this.state.user);
    }

    
    
    render() {
        return (
            <div>

                <PlayerSelect />
                
            </div>
    );
  }
}

export default Home;