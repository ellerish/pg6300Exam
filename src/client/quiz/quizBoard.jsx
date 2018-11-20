import React from "react";
import QuizState from "../../server/quiz/quizState";
import {quizzes} from "../../server/quiz/quizData";


export class QuizBoard extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.getDefaultState();

        this.resetBoard = this.resetBoard.bind(this);
        this.answerTag = this.answerTag.bind(this);
        this.handleOpponent = this.handleOpponent.bind(this);

    }

    getDefaultState() {
        return {
            board: new QuizState,
            currentQuizIndex: 0
        };
    }

    resetBoard() {
        this.setState(this.getDefaultState());
    }

    getBoardState() {
        return this.state.board;
    }

    setBoardState(board) {
        this.setState({board: board})
    }

    componentDidUpdate(prevProps, prevState) {
        this.handleOpponent();

    }

    componentDidMount() {
        this.handleOpponent();

    }


    answerTag(prefix, answer, correct) {
        let onclick;


        if (correct) {
            onclick = () => {
                this.displayNewQuiz();
            }
        } else {
            onclick = () => {
                alert('Wrong answer');
            };
        }

        return (
            <div className={"quizBtn"}
                 onClick={onclick}>
                {prefix + answer}
            </div>
        );
    }

    //If player.
    wrongAnswer() {

        let compoints = this.state.points - 1;

        this.setState({
            points: compoints
        });

    }


    displayNewQuiz() {
        let compoints = this.state.board.selectCorrectAnswer();

        let index = Math.floor(Math.random() * quizzes.length);

        if (index === this.state.currentQuizIndex) {
            index = (index + 1) % quizzes.length;
        }


        this.setState({
            currentQuizIndex: index, points: compoints
        });


    }

    handleOpponent() {
        if(this.state.board.points === 10){
        this.props.opponent.answerCorrect(this.state.points, this);
    }}


    getInfoMessage(res) {

        const board = this.state.board;
        //   const won =  board.points;
        //const won =  board.result === 1;

        const won = board.result === 1;
        const lost = board.result === 2;
       // this.props.opponent.answerCorrect(this.state.points, lost);

        // const won = this.state.isX ?
        // const lost = board.result === 2;
        //  const lost = board.result === 2;

        let msg;
        if (res === 0) {
            msg = "Ongoing Game"
        } else if (won) {
            msg = "You Got 10 points before your opponent!"
        } else if(lost){
            msg = "LOst!"
        }
        else if (res === 3) {
            msg = "The Game Ended in a Tie!"
        } else if (res === 4) {
            msg = "The opponent has forfeited. You won the game!"
        } else {
            throw "Invalid result code: " + res;
        }

        return msg;
    }


    renderGameFinish(){
        const msg = this.getInfoMessage(this.state.board.result);

        return(
            <div>
                <h2>{msg}</h2>
            </div>
        )
    }


    renderGameOn() {
        const quiz = quizzes[this.state.currentQuizIndex];
        const points = [this.state.board.points];


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

                <div>
                    <h2 className={"quizQuestion"}>
                        Points: {points}
                    </h2>

                    <h2>OnGoingGame</h2>
                </div>


            </div>
        );
    }


    render() {
        //const handler = this.props.newMatchHandler ? this.props.newMatchHandler : this.resetBoard;

        const board = this.state.board;
        let content;
        const on =  board.result;
        if(on === 0){
            content = this.renderGameOn();
        } else {
            content = this.renderGameFinish()
        }



        //  const quiz = quizzes[this.state.currentQuizIndex];
        //  const points = [this.state.points];
        return (
            <div>
                {content}

            </div>

        );


    }

}