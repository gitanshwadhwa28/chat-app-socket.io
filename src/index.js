const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./helper/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 5002

const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

let message = "Welcome"

io.on('connection', (socket) => {
    console.log("new connection")

    socket.emit('Message', generateMessage(message))
    socket.broadcast.emit('Message', generateMessage('A new user has joined'))

    socket.on('messageUpdate', (message1, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message1)) {
            return callback("Please refrain from using profanity, you piece of shit!")
        }
        io.emit('Message', generateMessage(message1))
        callback()
    })

    socket.on('location', (long, lat, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${lat},${long}`))
        callback("delivered")
    })

    socket.on('disconnect', () => {
        io.emit('Message', generateMessage('one of the users left'))
    })

})

server.listen(port, () => {
    console.log(`server is up on port ${port}`)
})
