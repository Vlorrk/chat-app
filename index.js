const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));



app.get('/', (req, res) => {
  res.sendFile(join(__dirname, './public/index.html'));
});



io.on('connection', (socket) => {

  socket.on('chat message', (msg) => {
    const messageWithSender = { message: msg, sender: socket.id }
    socket.broadcast.emit('chat message', messageWithSender);

    socket.emit('chat message', messageWithSender);
  })
});

server.listen(3000, () => {
  console.log('server is running on localhost:3000');
});
