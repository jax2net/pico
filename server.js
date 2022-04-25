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
    console.log(`${socket.id} has connected`);
    socket.on('left', data => {
        io.emit('left');
        console.log(`Response from ${socket.id}: ${data.input}`);
    });
    socket.on('right', data => {
        io.emit('right');
        console.log(`Response from ${socket.id}: ${data.input}`);
    });
    socket.on('jump', data => {
        io.emit('jump');
        console.log(`Response from ${socket.id}: ${data.input}`);
    });
    socket.on('stop', data => {
        io.emit('stop');
        console.log(`Response from ${socket.id}: ${data.input}`);
    });
    socket.on('gameover', data => {
        console.log('GAMEOVER FROM SERVER');
        io.emit('gameover');
    })
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected!`);
    });
});
