import React, { Component } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.switchView = this.switchView.bind(this);
        this.state = {signin: true};
    }

    switchView(){
        this.setState({signin: !this.state.signin});
        console.log(this.state.signin);
    }

    render() {
        return (
            <div className="App">
                
                {this.state.signin &&
                    <SignIn switch={this.switchView}/>
                }
                {!this.state.signin &&
                    <SignUp switch={this.switchView}/>
                }

            </div>
        );
    }

}

export default Auth;