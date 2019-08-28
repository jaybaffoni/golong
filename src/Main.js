import React, { Component } from 'react';
import fire from './Fire';
import Home from './components/Home';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

class Main extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }


    logout() {
        fire.auth().signOut();
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route path="/home" component={Home}/>
                        <Route path="*" render={() => <Redirect to="/home" />} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }

}

export default Main;