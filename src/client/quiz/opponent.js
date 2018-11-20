export  class Opponent{

    setSocket(socket){
        this.socket = socket;
    }

    setMatchId(matchId){
        this.matchId = matchId;
    }


    answerCorrect(pointStatus, boardCmp) {


       const boardState = boardCmp.getBoardState();

        this.socket.emit('insertion', {
            pointStatus: boardState.points,
            matchId: this.matchId
        });
    }

}
