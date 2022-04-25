const io = require('socket.io-client');
const io_client = io.connect('http://localhost:3000');

io_client.on("con", (msg) => console.info(msg));
