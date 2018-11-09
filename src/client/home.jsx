import React from "react";
import {Link} from 'react-router-dom';



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
                       <Link to={"/quizgame"} className={"btn"}>
                           Online Match
                       </Link>
                   ) : (
                       <div className="btnDeActive"></div>
                   )}
               </div>
           </div>

        );

    }

}
