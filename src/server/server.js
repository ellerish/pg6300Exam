const app = require("./app");
const webSocketHandler = require("./webSocket/websocket");

const port = 8080;
const server = require('http').Server(app);
webSocketHandler.start(server);

server.listen(port, () => {
    console.log('Starting server on port ' + port);
});






