const express = require('express');
var router = express.Router();
const http = require('http');
const { Server } = require('socket.io');
const Message = require('../models/message'); // Import schema Message
const User = require('../models/user'); // Import schema User


const server = http.createServer(router);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});





// Route để lưu tin nhắn vào MongoDB
router.post('/', async (req, res) => {
    try {
        const { gui, nhan, noi_dung, type } = req.body;

        const message = new Message({
            gui,
            nhan,
            noi_dung,
            type,
            trang_thai: 'gui',  // Mặc định trạng thái là "gui"
        });

        await message.save(); // Lưu tin nhắn vào DB
        res.status(200).json({ message: 'Message saved successfully!' });

        // Emit the new message to the recipients via socket.io
        io.to(nhan).emit('newMessage', {
            gui,
            nhan,
            noi_dung,
            type,
            trang_thai: 'gui',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Lắng nghe sự kiện socket và xử lý tin nhắn
io.on('connection', (socket) => {
    console.log('A user connected');

    // When a user joins a room (chat with a specific user)
    socket.on('joinRoom', (userId) => {
        socket.join(userId); // Join the room named after userId
        console.log(`User ${userId} joined the room`);
    });

    // When a message is sent
    socket.on('sendMessage', async (messageData) => {
        try {
            const { gui, nhan, noi_dung, type } = messageData;

            const message = new Message({
                gui,
                nhan,
                noi_dung,
                type,
                trang_thai: 'gui',
            });

            await message.save(); // Save the message in the database
            console.log('Message saved to DB:', message);

            // Emit the message to the recipient in real-time
            io.to(nhan).emit('newMessage', {
                gui,
                nhan,
                noi_dung,
                type,
                trang_thai: 'gui',
            });

        } catch (error) {
            console.log('Error sending message:', error);
        }
    });

    // Handle disconnecting
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


module.exports = router;
