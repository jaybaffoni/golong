import React, { Component } from 'react';
import { Button, Input,
         MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import fire from '../Fire';

class SignUp extends Component {
    
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
          email: '',
          displayname:'',
          password: '',
          confirm:'',
          modal:false,
          error:''
        };
    }
    
    handleChange(e) {
      this.setState({ [e.target.name]: e.target.value });
    }

    signup(e){
      e.preventDefault();
      if(this.state.password !== this.state.confirm){
        this.setState({modal:true, error:{message:"Passwords don't match"}});
        return;
      }
      console.log('Signing up');
      this.props.setDisplayName(this.state.displayname);
      fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((u)=>{
        
      })
      .catch((error) => {
          this.setState({modal:true, error:error});
      });
    }

    toggle = () => {
      this.setState({
        modal: !this.state.modal
      });
    }

    render() {
        return (
            <div>
                <MDBContainer>
                  <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                    <MDBModalHeader toggle={this.toggle}>Sign Up Error</MDBModalHeader>
                    <MDBModalBody>
                      {this.state.error.message}
                    </MDBModalBody>
                    <MDBModalFooter>
                      <MDBBtn color="primary" onClick={this.toggle}>Close</MDBBtn>
                    </MDBModalFooter>
                  </MDBModal>
                </MDBContainer>
                <div className="login-card">
                <h1>Go Long</h1>
                <p >Register a new account </p>
                <form>
                  <div className="grey-text">
                    <Input label="Enter your email" group type="email" name="email" onChange={this.handleChange} validate error="wrong" success="right" value={this.state.email}/>
                    <Input label="Choose a display name" group name="displayname" onChange={this.handleChange} validate error="wrong" success="right" value={this.state.displayname}/>
                    <Input label="Enter a password" group type="password" name="password" onChange={this.handleChange} validate value={this.state.password}/>
                    <Input label="Confirm your password" group type="password" name="confirm" onChange={this.handleChange} validate value={this.state.confirm}/>
                  </div>
                {this.state.error && (<p className="error-text">{this.state.message}</p>)}
                <Button block color="primary" onClick={this.signup}>Sign Up</Button>
                </form>
                <p style={{marginTop: 15}} >Already have an account? </p>
                <Button size="sm" block color="elegant" onClick={this.props.switch}>Sign In</Button> 
            </div>
            </div>
            
    );
  }
}

export default SignUp;