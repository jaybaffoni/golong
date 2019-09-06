import React, { Component } from 'react';
import { Button, Input } from 'mdbreact';

class SignIn extends Component {
    
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.createLeague = this.createLeague.bind(this);
        this.state = {
            lName: '',
            lPassword: '',
            userid: localStorage.getItem("uid")

        };        
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
    createLeague(){

    }
    
    render() {
        return (
            <div className="login-card">
                <h1>Go Long</h1>
                <p >Create a new League </p>
                <form>
                    <div className="grey-text">
                    <Input label="Enter League Name" group type="email" name="email" onChange={this.handleChange} validate error="wrong" success="right" value={this.state.user_name}/>
                    <Input label="Enter Password (Optional)" group type="password" name="password" onChange={this.handleChange} validate value={this.state.password}/>
                    </div>
                <Button block color="primary" onClick={this.createLeague}>Sign In</Button>
                </form>
                <p style={{marginTop: 15}} >Want to join a league instead?</p>
                <Button size="sm" block color="elegant" onClick={this.props.switch}>Join a league</Button> 
            </div>
    );
  }
}

export default SignIn;