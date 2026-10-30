const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

// Serve the index.html file directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to let frontend fetch the live tunnel link from meeting_link.txt
app.get('/get-tunnel-link', (req, res) => {
    const filePath = path.join(__dirname, 'meeting_link.txt');
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8').trim();
        if (fileContent.includes('https://')) {
            return res.json({ url: fileContent });
        }
    }
    res.json({ url: "Loading live link..." });
});

// --- REAL-TIME P2P SIGNALING HANDLER ---
io.on('connection', (socket) => {
    console.log('A device connected to signaling stack.');

    // 1. Peer attempts to establish or enter a targeted room context
   socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Device successfully mapped into room: ${roomId}`);
        // Notify any existing peer inside the room that a new user has joined
        socket.to(roomId).emit('user-joined');
    }); // <-- This correctly closes socket.on('join-room')

    // 2. THE WEBRTC BRIDGE: Relays offers, answers, ice-candidates, and chat text between peers
    socket.on('signal-message', (data) => {
        if (data && data.room) {
            socket.to(data.room).emit('signal-message', data);
        }
    });

    // 3. Clean up events when a peer closes their window
    socket.on('disconnect', () => {
        console.log('A device disconnected from room architecture.');
    });
});

// Start the local platform engine on port 3000
http.listen(3000, () => {
    console.log('Signaling core active and listening on http://localhost:3000');
});
