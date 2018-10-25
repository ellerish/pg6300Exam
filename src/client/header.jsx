import React from 'react';
import {Link, withRouter} from 'react-router-dom';



/*
    Header component for all pages, where we have a link to the
    home-page, and login/sing-up/logout buttons.
 */

class Header extends React.Component {

    constructor(props) {
        super(props);

        this.doLogout = this.doLogout.bind(this);
    }

    async doLogout(){

        const url = "/api/logout";
        let response;

        try {
            response = await fetch(url, {method: "post"});
        } catch (err) {
            alert("Failed to connect to server: "+ err);
            return;
        }

        if(response.status !== 204){
            alert("Error when connecting to server: status code "+ response.status);
            return;
        }

        this.props.updateLoggedIn(null);
        this.props.history.push('/');
    }

    renderLoggedIn(userId){
        return(
            <div>
                <h3>Welcome {userId}!!!</h3>
                <div className="btn" onClick={this.doLogout}>Log out</div>
            </div>
        );
    }


    renderNotLoggedIn() {
        return (
            <div>
                <p className="notLoggedInWelcome">Log in to start Quiz</p>

                <Link to="/login">Log In</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        );
    }


    render(){
        const userId = this.props.userId;

        let content;
        if(userId === null || userId === undefined){
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn(userId);
        }

        return(
            <div className={"header"}>
                <Link to={"/"}>Home</Link>
                {content}
            </div>
        );
    }

}


export default withRouter(Header);
