export  class Opponent{

    setSocket(socket){
        this.socket = socket;
    }

    setMatchId(matchId){
        this.matchId = matchId;
    }

    setMatchResult(resultStatus, boardCmp){
        const boardState = boardCmp.getBoardState();

        this.socket.emit('insertion', {
            resultStatus: boardState.result,
            matchId: this.matchId
        });
    }


}
