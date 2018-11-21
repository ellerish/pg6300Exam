export  class Opponent{

    setSocket(socket){
        this.socket = socket;
    }

    setMatchId(matchId){
        this.matchId = matchId;
    }

    setMatchResult(pointStatus, boardCmp){
        const boardState = boardCmp.getBoardState();

        this.socket.emit('insertion', {
            pointStatus: boardState.points,
            //resultStatus: boardState.result,
            matchId: this.matchId
        });
    }


}
