import React from "react";
import openSocket from 'socket.io-client';
//import {QuizBoard} from "./quizBoard";
import {Opponent} from "./opponent";

import {quizzes} from "../../server/quiz/quizData";
//import QuizState from "../../server/quiz/quizState";


export class QuizGame extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            matchId: null,
            opponentId: null,
            errorMsg: null,
            currentQuizIndex: 0,
            points: 0
        };


        this.refToQuizBoard = React.createRef();
        this.opponent = new Opponent();

        this.startNewQuiz = this.startNewQuiz.bind(this);

    }


    componentDidMount() {

        const userId = this.props.userId;
        if (userId === null) {
            this.setState({errorMsg: "You should log in first"});
            return;
        }

        this.socket = openSocket(window.location.origin);
        this.socket.on("update",  (dto) => {

            if (dto === null || dto === undefined) {
                this.setState({errorMsg: "Invalid response from server."});
                return;
            }

            if (dto.error !== null && dto.error !== undefined) {
                this.setState({errorMsg: dto.error});
                return;
            }

            const data = dto.data;

            this.setState({
                matchId: data.matchId,
                opponentId: data.opponentId
            });

            this.opponent.setMatchId(data.matchId);

            /*
                After the opponent has done its move, or this is the
                first one, we update the state of the board.
                The state of the board in the client (ie the Browser) is
                only used to display (eg building the HTML).
                The actual state that matters is the one on the server.
                Each time a client does an action, the server must verify that
                the action is valid, and a user is not trying to cheat.

            const boardCmp = this.refToQuizBoard.current;
            boardCmp.setBoardState(new QuizState(data.boardDto));
             */
        });

        this.socket.on('disconnect', () => {
            this.setState({errorMsg: "Disconnected from Server."});
        });


        this.opponent.setSocket(this.socket);

        /*
            Once a WebSocket is established, we need to authenticate it.
            Once authenticated, we can ask the server to start a new match.
         */
        this.doLogInWebSocket(userId).then(
            this.startNewQuiz
        );
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    answerTag(prefix, answer, correct) {
        let onclick;

        if (correct) {
            onclick = () => {alert('Correct!!!'); this.displayNewQuiz() }
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
            matchId: null,
            opponentId: null,
            errorMsg: null,
           // currentQuizIndex: index
        });

        const url = "/api/quizgame";

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


    async doLogInWebSocket(userId) {

        /*
            WebSockets do not have direct support for authentication.
            So, here we first do an authenticated AJAX call to get a unique
            token associated with the current logged in user via the session
            cookie. Then, we emit such tokens on the WS connection to tell the
            server that such connection is coming from the logged in user, and
            not someone else.
            Note: this works because there is going to be a different WS socket
            on the server for each user.
         */

        const url = "/api/wstoken";

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

        if (response.status !== 201) {
            this.setState({errorMsg: "Error when connecting to server: status code " + response.status});
            return;
        }

        const payload = await response.json();

        this.socket.emit('login', payload);
    };


    render() {


        if (this.state.errorMsg !== null) {
            return <div><p>[FAILURE] {this.state.errorMsg}</p></div>
        }

       if (this.state.matchId === null) {

            return <div><h3>Searching for a worthy opponent</h3></div>
        }

        const quiz = quizzes[this.state.currentQuizIndex];
        return (

            <div>
                <h2>{"Match against " + this.state.opponentId} </h2>
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