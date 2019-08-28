import React, { Component } from 'react';
import { Button, Input } from 'mdbreact';
import fire from '../Fire';

class SignIn extends Component {
    
    constructor(props){
        super(props);

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            email: '',
            password: ''
          };        
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
      login(e) {
        e.preventDefault();
        console.log('logging in');
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{console.log(u)}).catch((error) => {
            console.log(error);
        });
      }
    
    render() {
        return (
            <div className="login-card">
                    <h1>Go Long</h1>
                    <p style={{marginTop: 15}} >Sign in to your account </p>
                    <form>
                      <div className="grey-text">
                        <Input label="Enter email" group type="email" name="email" onChange={this.handleChange} validate error="wrong" success="right" value={this.state.user_name}/>
                        <Input label="Enter password" group type="password" name="password" onChange={this.handleChange} validate value={this.state.password}/>
                      </div>
                    <Button block color="primary" onClick={this.login}>Sign In</Button>
                    </form>
                    <p style={{marginTop: 15}} >Don't have an account?</p>
                    <Button block color="elegant" onClick={this.props.switch}>Sign Up</Button> 
                </div>
    );
  }
}

export default SignIn;