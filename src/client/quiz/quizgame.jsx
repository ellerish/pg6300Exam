import React from "react";
import openSocket from 'socket.io-client';
import {QuizBoard} from "./quizBoard";
import {Opponent} from "./opponent";



import {quizzes} from "../../server/quiz/quizData";

import {winner} from "../../server/quiz/ongoing_matches"

import QuizState from "../../server/quiz/quizState";


export class QuizGame extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            matchId: null,
            opponentId: null,
            errorMsg: null,
            points: 0
        };

        this.refToQuizBoard = React.createRef();
        this.opponent = new Opponent();
        this.startNewQuiz = this.startNewQuiz.bind(this);
    }


    componentDidMount() {

        const userId = this.props.userId;

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
                opponentId: data.opponentId,
            });

            this.opponent.setMatchId(data.matchId);

            const boardCmp = this.refToQuizBoard.current;
            boardCmp.setBoardState(new QuizState(data.boardDto));

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


    async startNewQuiz() {

        this.setState({
            matchId: null,
            opponentId: null,
            errorMsg: null
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

            return <div><h3>Searching for a opponent, be ready</h3></div>
        }

        return (
            <div>
                <h2>{"Match against " + this.state.opponentId} </h2>
                <QuizBoard
                    ref={this.refToQuizBoard}
                    opponent={this.opponent}
                    newMatchHandler={this.startNewQuiz}
                />
                </div>


        );
    }




}
