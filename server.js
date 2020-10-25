const http = require('http');
const app = require('./app');
const config = require('./app/config');
require('dotenv').config({ path: __dirname + '/.env' })
const PORT = process.env.PORT || 80;

const server = http.createServer(app);

server.listen(PORT, function () {
    console.log('Listening on Port ', PORT);
})