// Tuodaan tarvittavat kirjastot
const express = require('express'); // Express-kirjasto web-sovellusten rakentamiseen
const fs = require('fs').promises; // Tiedostojen käsittelyyn käytettävä kirjasto
const path = require('path'); // Polkujen käsittelyyn käytettävä kirjasto
const { createServer } = require('http'); // HTTP-palvelimen luomiseen
const { Server } = require('socket.io'); // WebSocket-yhteyksien käsittelyyn

const app = express(); // Luodaan Express-sovellus
const PORT = process.env.PORT || 3000; // Määritetään portti
const server = createServer(app); // Luodaan HTTP-palvelin
const io = new Server(server); // Luodaan Socket.IO palvelin

// Määritetään polku julkisiin tiedostoihin
const polku = path.join(__dirname, './public');

// Palvelin toimii /henkilokunta-reitillä ja palauttaa henkilökunta-tiedoston sisällön
app.get('/henkilokunta', async (req, res) => {
    try {
        const data = await fs.readFile('henkilokunta.json', 'utf8'); // Luetaan JSON-tiedosto
        res.json(JSON.parse(data)); // Lähetetään JSON-tietona asiakkaalle
    } catch (err) {
        res.status(500).send('Virhe tiedoston lukemisessa'); // Virheilmoitus tiedoston lukemisen epäonnistuessa
    }
});

// Reitti PIN-koodin lukemiselle
app.get('/api/getpin', async (req, res) => {
    try {
        const savedPin = await fs.readFile('./pin.txt', 'utf-8'); // Luetaan PIN-koodi tiedostosta
        res.json(savedPin); // Lähetetään PIN-koodi asiakkaalle
    } catch (error) {
        console.error('Error reading file:', error); // Virheviesti konsoliin
        res.status(500).send('Internal Server Error'); // Virheilmoitus
    }
});

// Palvellaan staattisia tiedostoja public-kansiosta
app.use(express.static(path.join(__dirname, 'public')));

// Palvelin palvelee pääsivua
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Lähetetään index.html-tiedosto
});

// Käsitellään Socket.IO-yhteydet
io.on('connection', (socket) => {
    console.log('Uusi asiakas yhdistetty'); // Ilmoitus uudesta asiakkaasta

    // Kun palvelin vastaanottaa viestin, se lähettää sen kaikille asiakkaille
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Lähetetään viesti kaikille
    });

    // Asiakkaan irrottautumis tapahtuma
    socket.on('disconnect', () => {
        console.log('Asiakas irrottautui'); // Ilmoitus asiakkaan irrottautumisesta
    });
});

// Käynnistetään palvelin
server.listen(PORT, () => {
    console.log(`Palvelin käynnistetty osoitteessa http://localhost:${PORT}`); // Ilmoitus palvelimen käynnistämisestä
});