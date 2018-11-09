const {displayNewQuiz} = require('./quizData');


class QuizState {

    constructor(dto){
        if(dto === undefined || dto === null){
            this.resetGame();
        } else {
          // this.currentQuizIndex= dto.currentQuizIndex;
           //  this.quiz = displayNewQuiz(dto);
           // this.counter = dto.counter;
          //  this.points = getPoints();
            //this.result = dto.result;
        }
    }

    resetGame(){
        this.quiz = displayNewQuiz();

    }







}




module.exports = QuizState;