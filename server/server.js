const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('HI FORTNITE');
    io.emit('con', 'I love fortnite.');
});

io.on('connection', (socket) => {
    console.log('A client has connected');
    io.emit('con', 'You have connected to the WS Server.');
    socket.on('response', msg => {
        io.emit('Response from server: ', "The 21st nite of september?");
        console.log('Response from Client: ', msg);
    });
    socket.on('disconnect', () => {
        console.log('Disconnected.');
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
