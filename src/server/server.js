const app = require("./app");
const webshandler = require("./webSocket/websocket");

const port = 8080;
const server = require('http').Server(app);
webshandler.start(server);

server.listen(port, () => {
    console.log('Starting server on port ' + port);
});






