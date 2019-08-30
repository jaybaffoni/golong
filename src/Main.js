import React, { Component } from 'react';
import fire from './Fire';
import Home from './components/Home';
import { Button, MDBNavbar, MDBNavbarToggler, MDBCollapse, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink } from 'mdbreact';
import Leagues from './components/Leagues';

class Main extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.state = {isOpen:false};
    }

    logout() {
        fire.auth().signOut();
    }

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        return (
            <div className="App">
                    <MDBNavbar color="black" dark expand="md">
                        <MDBNavbarBrand>
                        <strong>Go Long</strong>
                        </MDBNavbarBrand>
                        <MDBNavbarToggler onClick={this.toggleCollapse} />
                        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active>
                            <MDBNavLink to="#!">Home</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                            <MDBNavLink to="#!">Features</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                            <MDBNavLink to="#!">Pricing</MDBNavLink>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            
                        </MDBNavbarNav>
                        </MDBCollapse>
                    </MDBNavbar>
            </div>
        );
    }

}

export default Main;