const http = require('http');
const app = require('./app');
const config = require('./app/config');

const PORT = config.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, function () {
    console.log('Listening on Port ', PORT);
})