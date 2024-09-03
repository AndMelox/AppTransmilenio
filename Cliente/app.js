const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../Cliente'))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Cliente/index.html'));
});

app.get('/buses', (req, res) => {
    const buses = leerBuses();
    res.status(200).json(buses);
});

function leerBuses() {
    const data = fs.readFileSync('buses.json', 'utf8');
    return JSON.parse(data);
}

function escribirBuses(buses) {
    fs.writeFileSync('buses.json', JSON.stringify(buses, null, 2));
}

app.post('/buses', (req, res) => {
    const { placa, horaLlegada } = req.body;

    if (!placa || !horaLlegada) {
        return res.status(400).send('Placa y hora de llegada son requeridos.');
    }

    const buses = leerBuses();
    let bus = buses.buses.find(b => b.placa === placa);

    if (bus) {
        
        bus.registros.push({
            ordenRegistro: bus.registros.length + 1,
            horaLlegada: horaLlegada
        });
        bus.ediciones += 1;
    } else {
        
        buses.buses.push({
            placa: placa,
            registros: [{
                ordenRegistro: 1,
                horaLlegada: horaLlegada
            }],
            ediciones: 0
        });
    }

    escribirBuses(buses);
    res.status(200).send('Bus registrado/actualizado correctamente.');
});

app.delete('/buses/:placa', (req, res) => {
    const { placa } = req.params;

    const buses = leerBuses();
    const index = buses.buses.findIndex(b => b.placa === placa);

    if (index === -1) {
        return res.status(404).send('Bus no encontrado.');
    }

    buses.buses.splice(index, 1);
    escribirBuses(buses);
    res.status(200).send('Bus borrado correctamente.');
});

app.get('/buses/:placa', (req, res) => {
    const { placa } = req.params;

    const buses = leerBuses();
    const bus = buses.buses.find(b => b.placa === placa);

    if (!bus) {
        return res.status(404).send('Bus no encontrado.');
    }

    res.status(200).json(bus);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
