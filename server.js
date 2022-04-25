const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set('port', 8080);
app.use('/static', express.static(__dirname + '/static'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});

io.on('connection', (socket) => {
    console.log('A client has connected');
    io.emit('con', 'You have connected to the WS Server.');
    socket.on('left', input => {
        io.emit('left');
        io.emit('SERVER: You have pressed left.');
        console.log('Response from Client: ', input);
    });
    socket.on('right', input => {
        io.emit('right');
        io.emit('SERVER: You have pressed right.');
        console.log('Response from Client: ', input);
    });
    socket.on('jump', input => {
        io.emit('jump');
        io.emit('SERVER: You have pressed jump.');
        console.log('Response from Client: ', input);
    });
    socket.on('disconnect', () => {
        console.log('Disconnected.');
    });
});



