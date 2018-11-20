import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Home} from "./home";
import Header from "./header"
import Login from "./login";
import SignUp from "./signup";
import {QuizGame} from "./quiz/quizgame";


/*
    Index render info based on if a user is logged in or not.

    Code from the PG6300 course on *Web Development and API Design* /Andrea Arcuri
 */

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userId: null
        };

        this.updateLoggedIn = this.updateLoggedIn.bind(this);

    }
    componentDidMount(){
        this.checkIfUserAlreadyLoggedIn();
    }


    async checkIfUserAlreadyLoggedIn() {
        const url = "/api/user";

        let response;

        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }

        if (response.status === 401) {
            //that is ok
            this.updateLoggedIn(null);
            return;
        }

        if (response.status !== 200) {
        } else {
            const payload = await response.json();
            this.updateLoggedIn(payload.userId);
        }

    }

    notFoundMsg(){
        return(
            <div>
                <h2>404: NOT FOUND</h2>
            </div>
        );
    };

    updateLoggedIn(userId) {
        this.setState({userId: userId})
    }
    render(){
        return(
            <BrowserRouter>
                <div>
                    <Header userId={this.state.userId}  updateLoggedIn={this.updateLoggedIn}/>
                    <Switch>
                        <Route exact path="/"
                               render={props => <Home {...props} userId={this.state.userId}/>}/>
                        <Route exact path="/login"
                               render={props => <Login {...props}
                                                       userId={this.state.userId}
                                                       updateLoggedIn={this.updateLoggedIn}/>}/>
                        <Route exact path="/signup"
                               render={props => <SignUp {...props}
                                                        userId={this.state.userId}
                                                        updateLoggedIn={this.updateLoggedIn}/>}/>
                        <Route exact path="/quizgame"
                               render={props => <QuizGame {...props}
                                                          userId={this.state.userId}
                                                          updateLoggedIn={this.updateLoggedIn}/>}/>

                        <Route component={this.notFoundMsg}/>
                    </Switch>
                </div>
            </BrowserRouter>


        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));