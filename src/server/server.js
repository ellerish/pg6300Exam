const app = require("./app");

const port = 8080;
const server = require('http').Server(app);

server.listen(port, () => {
    console.log('Starting server on port ' + port);
});






