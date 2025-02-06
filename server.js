const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000; // Allows using the port provided by the hosting platform
const server = createServer(app);
const io = new Server(server);

// Define the path for the public directory
const polku = path.join(__dirname, './public');

// Serve staff information from a JSON file
app.get('/henkilokunta', async (req, res) => {
    try {
        const data = await fs.readFile('henkilokunta.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).send('Virhe tiedoston lukemisessa');
    }
});

// Reading PIN code from a text file on the server and sending it to the client
app.get('/api/getpin', async (req, res) => {
    try {
        // Read the content of the text file
        const savedPin = await fs.readFile('./pin.txt', 'utf-8');
        
        // Send the file content as the response
        res.json(savedPin);
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('Uusi asiakas yhdistetty');

    // When the server receives a message, it emits it to all clients immediately
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Client disconnect event
    socket.on('disconnect', () => {
        console.log('Asiakas irrottautui');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Palvelin käynnistetty osoitteessa http://localhost:${PORT}`);
});