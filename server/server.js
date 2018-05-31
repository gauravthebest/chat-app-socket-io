const path = require('path');
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server)

io.on('connection', (socket) => {
    console.log('New User Connected!');
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });

    socket.broadcast.emit('newMessage',  generateMessage('Admin', 'New User Joined'));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatApp.'));

    socket.on('createMessage', (message) => {
        console.log(message);
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('createLocationMessage', (position, callback) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', position.latitude, position.longitude));
        callback();
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});