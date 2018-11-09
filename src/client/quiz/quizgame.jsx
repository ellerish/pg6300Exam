import React from "react";
import openSocket from 'socket.io-client';
import {QuizBoard} from "./quizBoard";


export class QuizGame extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            matchId: null,
           // opponentId: null,
            errorMsg: null
        };

        this.startNewQuiz = this.startNewQuiz.bind(this);
        this.refToQuizBoard = React.createRef();
        //this.opponent = new OpponentOnline();


    }

    componentDidMount(){

        const userId = this.props.userId;
        if (userId === null) {
            this.setState({errorMsg: "You should log in first"});
            return;
        }

      //  const boardQuiz = this.refToQuizBoard.current;
       // boardQuiz.currentQuizIndex
    }





     async startNewQuiz() {

        this.setState({
             matchId: null,
          //  opponentId: null,
            errorMsg: null,
        });

        const url = "/quizgame";

        let response;

       try {
            response = await fetch(url, {
                method: "post"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }


        if (response.status === 401) {
            //this could happen if the session has expired
            this.setState({errorMsg: "You should log in first"});
            this.props.updateLoggedIn(null);
            return;
        }

        if (response.status !== 201 && response.status !== 204) {
            this.setState({errorMsg: "Error when connecting to server: status code " + response.status});
            return;
        }


    };



    render() {

        if (this.state.errorMsg !== null) {
            return <div><p>[FAILURE] {this.state.errorMsg}</p></div>
        }

        if (this.state.matchId === null) {

            return <div><h3>Searching for a worthy opponent</h3></div>
        }


        return (
            <div>
                <div>
              <h2>HEI</h2>
                </div>
               <QuizBoard
                    ref={this.refToQuizBoard}
                    newQuiz={this.startNewQuiz()}
                />

            </div>
        );
    }

}