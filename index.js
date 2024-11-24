const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// leer el repertorio
const getRepertorio = () => {
    try {
        return JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
    } catch (error) {
        console.error("Error al leer repertorio.json:", error);
        return [];
    }
};

// Guardar el repertorio
const saveRepertorio = (data) => {
    try {
        fs.writeFileSync("repertorio.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al guardar repertorio.json:", error);
    }
};

// obtiene todas las canciones
app.get("/canciones", (req, res) => {
    res.json(getRepertorio());
});

// agregar una nueva canción
app.post("/canciones", (req, res) => {
    try {
        const canciones = getRepertorio();
        const nuevaCancion = req.body;
        nuevaCancion.id = Math.floor(Math.random() * 10000);
        canciones.push(nuevaCancion);
        saveRepertorio(canciones);
        res.status(201).send("¡Canción agregada con éxito!");
    } catch (error) {
        res.status(500).send("Error en el servidor.");
    }
});

// edita una canción
app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const cancion = req.body;
    const canciones = getRepertorio();
    const index = canciones.findIndex(c => c.id == id);
    if (index !== -1) {
        canciones[index] = { ...canciones[index], ...cancion };
        saveRepertorio(canciones);
        res.send("¡Canción modificada con éxito!");
    } else {
        res.status(404).send("Canción no encontrada");
    }
});

// eliminar una canción
app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const canciones = getRepertorio();
    const nuevasCanciones = canciones.filter(c => c.id != id);
    if (nuevasCanciones.length !== canciones.length) {
        saveRepertorio(nuevasCanciones);
        res.send("¡Canción eliminada con éxito!");
    } else {
        res.status(404).send("Canción no encontrada");
    }
});

app.listen(PORT, () => console.log(`¡Servidor encendido en http://localhost:${PORT}`));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});