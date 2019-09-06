import React, { Component } from 'react';
import { Button, Input,
         MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter} from 'mdbreact';
import fire from '../Fire';

class SignIn extends Component {
    
    constructor(props){
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            email: '',
            password: '',
            modal:false,
            error:''
          };        
    }

    toggle = () => {
      this.setState({
        modal: !this.state.modal
      });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
      login(e) {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{

        }).catch((error) => {
          this.setState({modal:true, error:error});
        });
      }
    
    render() {
        return (
            <div>
                <MDBContainer>
                  <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                    <MDBModalHeader toggle={this.toggle}>Sign In Error</MDBModalHeader>
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
                    <p >Sign in to your account </p>
                    <form>
                      <div className="grey-text">
                        <Input label="Enter email" group type="email" name="email" onChange={this.handleChange} validate error="wrong" success="right" value={this.state.user_name}/>
                        <Input label="Enter password" group type="password" name="password" onChange={this.handleChange} validate value={this.state.password}/>
                      </div>
                    <Button block color="primary" onClick={this.login}>Sign In</Button>
                    </form>
                    <p style={{marginTop: 15}} >Don't have an account?</p>
                    <Button size="sm" block color="elegant" onClick={this.props.switch}>Sign Up</Button> 
                </div>
            </div>
    );
  }
}

export default SignIn;