const socketIo = require('socket.io');
const Tokens = require('./token');

let socketio;

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
        })

    })
};

module.exports = {start};