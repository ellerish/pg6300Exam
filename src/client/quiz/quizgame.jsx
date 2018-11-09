import React from "react";
import openSocket from 'socket.io-client';
import {QuizBoard} from "./quizBoard";

import {quizzes} from "../../server/quiz/quizData";


export class QuizGame extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
         //   matchId: null,
           // opponentId: null,
            errorMsg: null,
            currentQuizIndex: 0
        };

      //  this.startNewQuiz = this.startNewQuiz.bind(this);
       // this.refToQuizBoard = React.createRef();
        //this.opponent = new OpponentOnline();

        this.startNewQuiz = this.startNewQuiz.bind(this);

    }

    componentDidMount(){

        const userId = this.props.userId;
        if (userId === null) {
            this.setState({errorMsg: "You should log in first"});
            return;
        }

        const currentQuizIndex = 0;

      //  const boardQuiz = this.refToQuizBoard.current;
       // boardQuiz.currentQuizIndex
    }

    answerTag(prefix, answer, correct) {
        let onclick;

        if (correct) {
            onclick = () => {alert('Correct!!!'); this.displayNewQuiz()}
        } else {
            onclick = () => {alert('Wrong answer');};
        }

        return (
            <div className={"quizBtn"}
                 onClick={onclick}>
                {prefix + answer}
            </div>
        );
    }

    displayNewQuiz(){

        let index = Math.floor(Math.random() * quizzes.length);

        if (index === this.state.currentQuizIndex) {
            index = (index + 1) % quizzes.length;
        }
        this.setState({currentQuizIndex: index});
    }


     async startNewQuiz() {


         let index = Math.floor(Math.random() * quizzes.length);

         if (index === this.state.currentQuizIndex) {
             index = (index + 1) % quizzes.length;
         }

        this.setState({
          //   matchId: null,
          //  opponentId: null,
            errorMsg: null,
            currentQuizIndex: index
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

      /*  if (this.state.matchId === null) {

            return <div><h3>Searching for a worthy opponent</h3></div>
        }

*/
        const quiz = quizzes[this.state.currentQuizIndex];
        return (

            <div>
                <div>
                <h2 className={"quizQuestion"}>
                    Question: {quiz.question}
                </h2>
                </div>

                <div>
                {this.answerTag("A: ", quiz.answer_0, quiz.indexOfRightAnswer === 0)}
                {this.answerTag("B: ", quiz.answer_1, quiz.indexOfRightAnswer === 1)}
                {this.answerTag("C: ", quiz.answer_2, quiz.indexOfRightAnswer === 2)}
                {this.answerTag("D: ", quiz.answer_3, quiz.indexOfRightAnswer === 3)}
                </div>

            </div>
        );
    }

}