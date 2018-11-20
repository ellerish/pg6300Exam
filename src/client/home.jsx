import React from "react";
import {Link} from 'react-router-dom';

/*
    Home Page render info based on if a user is logged in or not.
 */

export class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
         const userId = this.props.userId;
         const loggedIn = (userId !== null && userId !== undefined);

        return(
           <div>
               <div>
                   <h2>QUIZ GAME</h2>
               </div>

               <div className="btnPart">

                   {loggedIn ? (

                       <div className="gameInfo">
                           <h3>This Quiz will start as soon as another participant is connected,
                               This is a infinity match,
                               The first one to get 10 points will get notified, and wait for the other participant
                               to get 10 points, and then its a new round on questions.
                               The game continues till one of you forfeit.
                               Good Luck
                           </h3>

                           <Link to={"/quizgame"} className={"btn"}>
                               Online Game
                           </Link>
                       </div>

                   ) : (

                       <div className="notLoggedInWelcome">
                           <p></p>
                       </div>
                   )}
               </div>


           </div>

        );

    }

}
