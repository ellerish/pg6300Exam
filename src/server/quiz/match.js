const crypto = require("crypto");

//const BoardState = require('./quizState');
const ActivePlayers = require('./activePlayer');

/*
    Class used to represent a Match between two players.
    Every time a player does a move, we need to inform the opponent.
    This is done via WebSockets.

    Each match will have an id selected at random.
 */
class Match{

    constructor(firstPlayerId, secondPlayerId, callbackWhenFinished){

     //   this.board = new BoardState();

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
      //  this.xId = this.playerIds[Math.floor(Math.random() * 2)];

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

            const counter = data.counter;
            const position = data.position;
            const matchId = data.matchId;

            console.log("Handling message from '" + userId+"' for counter " + counter
                + " in match " + this.matchId);

            const expectedCounter = this.board.counter + 1;

            /*
                We start with some input validation, eg checking if the received
                message was really meant for this ongoing match.
             */

            if(counter !== expectedCounter){
                socket.emit("update", {error: "Invalid operation"});
                console.log("Invalid counter: "+counter+" !== " + expectedCounter);
                return;
            }

            if(matchId !== this.matchId){
                console.log("Invalid matchId: "+matchId+" !== " + this.matchId);
                return;
            }


         /*   //update the state of the game
            this.board.selectColumn(position);

            //send such state to the opponent
            this.sendState(this.opponentId(userId));

            if(this.board.isGameFinished()){
                this.callbackWhenFinished(this.matchId);
            }
            */
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
              //  boardDto: this.board.extractDto(),
                opponentId: this.opponentId(userId)
            }
        };

        const socket = this.sockets.get(userId);

        socket.emit('update', payload);
    }

    sendForfeit(userId){

     //   this.board.doForfeit();
        this.sendState(this.opponentId(userId));
    }
}


module.exports = Match;