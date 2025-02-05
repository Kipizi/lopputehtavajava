const express = require('express');
const fs = require('fs').promises
const path = require('path');

const app = express();
const PORT = 3000;

// Määritä public-kansio staattisiksi tiedostoiksi
app.use(express.static(path.join(__dirname, 'public')));

// Palvelinpalvelu HTML-tiedostolle
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Palvelinpalvelu henkilökunnan tiedoille
app.get('/henkilokunta', (req, res) => {
    fs.readFile('henkilokunta.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Virhe tiedoston lukemisessa');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Käynnistetään palvelin
app.listen(PORT, () => {
    console.log(`Palvelin käynnistetty osoitteessa http://localhost:${PORT}`);
});
// Pinkoodin lukeminen txt tiedostosta pelvelimelta ja lähettäminen selaimelle   
app.get('/api/getpin', async (req, res) => {
    try {
        // Read the content of the text file
        const savedPin = await fs.readFile('./pin.txt', 'utf-8')
        
        // Send the file content as the response
        res.json(savedPin)
    } catch (error) {
        console.error('Error reading file:', error)
        res.status(500).send('Internal Server Error')
    }
    })
    const polku = path.join(__dirname, './public')

// Sanotaan että em. polussa on tiedostosisältö jota palvelin käyttää kun se saa http requestin
app.use(express.static(polku))

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})