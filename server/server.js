const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    io.emit('con', 'I love fortnite.'); // initial connection message, not necessary
});

io.on('connection', (socket) => {
    console.log('A client has connected');
    io.emit('con', 'You have connected to the WS Server.');
    socket.on('jump', input => {
        io.emit('SERVER: You have pressed jump.');
        console.log('Response from Client: ', input);
    });
    socket.on('disconnect', () => {
        console.log('Disconnected.');
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
