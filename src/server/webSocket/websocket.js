const socketIo = require('socket.io');
const Tokens = require('./token');
const ActivePlayer = require('../quiz/activePlayer');
const OngoingMatches = require('../quiz/ongoing_matches');

let socketio;

/*
    Code from the PG6300 course on *Web Development and API Design* /Andrea Arcuri
 */

const start = (server) => {
    socketIo(server);

    socketio = socketIo(server);

    socketio.on('connection', function (socket) {

        socket.on('login', (data) => {

            if(data === null || data === undefined) {
                socket.emit("update", {error: "No payload provided"});
            }

            const token = data.wstoken;


            if(token === null || token === undefined){
                socket.emit("update", {error: "Missing token"});
                return;
            }

            //token can be used only once to authenticate only a single socket
            const userId = Tokens.consumeToken(token);

            if(userId === null || userId === undefined){
                socket.emit("update", {error: "Invalid token"});
                return;
            }

            /*
              if token was valid, then we can create an authenticated
              association with the given user for that token and the
              current socket
           */
            ActivePlayer.registerSocket(socket, userId);

            console.log("User '"+userId+"' is now connected with a websocket.");
        });

        //disconnect is treated specially
        socket.on('disconnect',  () => {

            const userId = ActivePlayer.getUser(socket.id);

            ActivePlayer.removeSocket(socket.id);

            /*
                if a user is leaving, any of its ongoing matches should be
                forfeit, which means that the opponent wins.
                If we do not do this, a user could cheat by just quitting
                the connection when it sees that it is losing a match
             */
            OngoingMatches.forfeit(userId);

            console.log("User '"+userId+"' is disconnected.");
        });
    });

};

module.exports = {start};