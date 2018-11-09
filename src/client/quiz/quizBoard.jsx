import React from "react";
import QuizState from "../../server/quiz/quizState";

export class QuizBoard extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.getDefaultState();

       // this.selectCell = this.selectCell.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        //this.handleOpponent = this.handleOpponent.bind(this);
    }

    getDefaultState() {

        //choose at random whether starting or not. X starts first.
       // const isX = Math.random() >= 0.5;

        return {
            board: new QuizState(),
         /*   posToInsert: null,
            isX: isX,
           // needHandleOpponent: ! isX,
            lastInsertedColumn: null
            */
        };
    }


    resetBoard() {
        this.setState(this.getDefaultState());
    }

    getBoardState(){
        return this.state.board;
    }

    setBoardState(board){
        this.setState({board: board})
    }

    playerIsNext() {

    }



    /*
        React life-cycle method called after component is re-rendered
        due to state change
     */
 /*   componentDidUpdate(prevProps,prevState){
        if(this.state.needHandleOpponent){
            this.handleOpponent();
        }
    }

    componentDidMount(){
        if(this.state.needHandleOpponent){
            this.handleOpponent();
        }
    }

    /*
        Once we do our move, we need to wait for the opponent to do its move.
        To do that, we need to inform the opponent's object to play the next
        move.
        This needs to be done only once per turn.
        However, if it is the opponent which is starting, we still need to handle
        this code. And that is the reason why we call it even from the mounting
        of the component when the current user has not done any action yet.
     */
 /*   handleOpponent(){
        this.setState({needHandleOpponent: false});

        this.props.opponent.playNext(this.state.lastInsertedColumn, this);
    }



  /*  getInfoMessage(res) {

        const board = this.state.board;
        const won = this.state.isX ? board.result === 1 : board.result === 2;
        const lost = this.state.isX ? board.result === 2 : board.result === 1;

        let msg;
        if (res === 0) {
            const label = this.state.board.nextLabelToPlay();
            if(this.playerIsNext()){
                msg = "Your turn. Playing " + label;
            } else {
                msg = "Opponent's turn. Playing " + label;
            }
        } else if (won) {
            msg = "You Won! Well Done!"
        } else if (lost) {
            msg = "You Lost!"
        } else if (res === 3) {
            msg = "The Game Ended in a Tie!"
        } else if (res === 4) {
            msg = "The opponent has forfeited. You won the game!"
        }else {
            throw "Invalid result code: " + res;
        }

        return msg;
    }
    */


    render() {

    //    const msg = this.getInfoMessage(this.state.board.result);

        const handler = this.props.newMatchHandler ? this.props.newMatchHandler : this.resetBoard;

        return (
            <div>
               /* <h2>{this.props.title}</h2>
                   /* <div className="btn" onClick={handler}>New Match</div>@/

                    */
                   <div>
                       <div className="btn" onClick={handler}>New Match</div>
                   </div>
            </div>
        );
    }



}