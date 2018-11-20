
const crypto = require("crypto");
const ActivePlayers = require('./activePlayer');
const QuizState = require('./quizState');

/*
    Code from the PG6300 course on *Web Development and API Design* /Andrea Arcuri

 */
class Match{

    constructor(firstPlayerId, secondPlayerId, callbackWhenFinished){

         this.board = new QuizState();

        this.playerIds = [firstPlayerId, secondPlayerId];

        this.matchId = this.randomId();


        /*
            Given two users playing this match, we need to get the WS sockets
            associated with them.
            Those are needed to send messages to those 2 users.
         */
        this.sockets = new Map();
        this.sockets.set(firstPlayerId, ActivePlayers.getSocket(firstPlayerId));
        this.sockets.set(secondPlayerId, ActivePlayers.getSocket(secondPlayerId));

        //who is starting is selected at random


        //instruct what to do once a match is finished
         this.callbackWhenFinished = callbackWhenFinished;
    }


    randomId(){
        return crypto.randomBytes(10).toString('hex');
    }

    start(){

        this.registerListener(this.playerIds[0]);
        this.registerListener(this.playerIds[1]);

        /*
            When a new match is started, we need to update
            both players, to inform them who has the first move.
         */
        this.sendState(this.playerIds[0]);
        this.sendState(this.playerIds[1]);
    }

    registerListener(userId){

        const socket = this.sockets.get(userId);

        socket.removeAllListeners('insertion');

        socket.on('insertion', data => {

            if (data === null || data === undefined) {
                socket.emit("update", {error: "No payload provided"});
                return;
            }

            const matchId = data.matchId;
            const result = data.result;


            if(matchId !== this.matchId){
                console.log("Invalid matchId: "+matchId+" !== " + this.matchId);
                return;
            }


            //this.board.boardStatus(result);

            //send such state to the opponent
            this.sendState(this.opponentId(userId));
            //console.log("test");


            if(this.board.isGameFinished()){
                this.callbackWhenFinished(this.matchId);
            }

        });


    }

    opponentId(userId){
        if(userId === this.playerIds[0]){
            return this.playerIds[1];
        }
        return this.playerIds[0];
    }

    sendState(userId){

        console.log("Sending update to '" +userId+"' for match " + this.matchId);

        const payload = {
            data: {
                matchId: this.matchId,
                boardDto: this.board.extractDto(),
                opponentId: this.opponentId(userId),
            }
        };

        const socket = this.sockets.get(userId);

        socket.emit('update', payload);
    }

    sendForfeit(userId){

        this.board.doForfeit();
        this.sendState(this.opponentId(userId));
    }


}


module.exports = Match;