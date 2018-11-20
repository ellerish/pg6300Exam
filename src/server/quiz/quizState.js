const {displayNewQuiz,  computePoints} = require ('./quizData');

class QuizState{


    constructor(dto) {
        if(dto === undefined || dto === null){
            this.resetBoard();
        } else {
            this.points = dto.points;
            this.result = dto.result;
           // this.quiz = displayNewQuiz(dto.quiz)
        }
    }

    extractDto() {
        return {
          //  quiz: displayNewQuiz(this.quiz),
            points: this.points,
            result: this.result
        };
    }

    copy() {
        return new QuizState(this.extractDto());
    }

    resetBoard() {
        this.points = 0;
        this.result = 0;
    }


    doForfeit(){
        this.result = 4;
    }

    isGameFinished() {
        return this.result !== 0;
    }

    itsATie(){
        this.result = 3;
    }

    selectCorrectAnswer(){
        this.points++;

        if(this.points === 10){
            this.result = 1;
        }

    }

    /*
    boardStatus(res){
        this.result = 2;
    }*/


}


module.exports = QuizState;