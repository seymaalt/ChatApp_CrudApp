// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
app.use(cors());
const allClients = [];
const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı');
    allClients.push(socket.id);
    socket.emit("sendSocketId", socket.id);
    socket.on('message', (message) => {
        io.emit('message',socket.id+":"+ message);
    });

    socket.on('disconnect', () => {
        let socketId = allClients.find(x => x == socket.id);
        let indexNo = allClients.indexOf(socketId);
        allClients.splice(indexNo, 1);
        console.log(socketId+' kullanıcı ayrıldı');
    });
});

server.listen(3000, () => {
    console.log('Socket.IO server running on port 3000');
});
