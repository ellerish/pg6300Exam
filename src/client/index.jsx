import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Home} from "./home";
import Header from "./header"
import Login from "./login";
import SignUp from "./signup";
import {QuizGame} from "./quiz/quizgame";


class App extends React.Component{
    constructor(props){
        // call the React.Component constructor (the super class, the one you are extending)
        super(props);

        /*
           As whether we are logged in or not will impact the rendering of
           all pages, such state info as to be stored here in the root component.
           If a user is logged in, then we stored its userId here.
           A null value means the user is not logged in.
        */

        this.state = {
            userId: null
        };

        this.updateLoggedIn = this.updateLoggedIn.bind(this);

    }
    componentDidMount(){
        // you can now change the state. You can do so in lifecycle methods, in event handler methods, etc...
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
            //TODO here could have some warning message in the page.
        } else {
            const payload = await response.json();
            this.updateLoggedIn(payload.userId);
        }

    }

    notFoundMsg(){
        return(
            <div>
                <h3>404</h3>
                <h2>NOT FOUND</h2>
                <p>ERROR: </p>
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
                               render={props => <QuizGame {...props} userId={this.state.userId}
                                                             updateLoggedIn={this.updateLoggedIm}/>}/>

                        <Route component={this.notFoundMsg}/>
                    </Switch>
                </div>
            </BrowserRouter>


        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));