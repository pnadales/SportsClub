const fs = require("fs");

const express = require('express');
const { log } = require("console");
const app = express();
const PORT = 3000;

app.listen(3000, () => console.log("Servidor escuchando Puerto: " + PORT));

function leer() {
    return JSON.parse(fs.readFileSync("deportes.json", "utf8"));
}
function actualizar(datos) {
    fs.writeFileSync("deportes.json", JSON.stringify({ "deportes": datos }))
}

function agregar(nombre, precio) {
    let datos = leer().deportes
    datos.push({ "nombre": nombre, "precio": precio })
    actualizar(datos)
}
function editar(nombre, precio) {
    let datos = leer().deportes;
    let editado = datos.map(deporte => {
        if (deporte.nombre == nombre) {
            deporte.precio = precio
        }
        return deporte
    })
    actualizar(editado)
}
function eliminar(nombre) {
    let datos = leer().deportes
    let noEliminados = datos.filter(deporte => deporte.nombre != nombre)
    actualizar(noEliminados)
}

// function validacionesNombre(nombre){
//     if(nombre=='' || !/^[a-zA-Z\s]+$/.test(nombre)){
//         return false
//     }else{
//         return true
//     }
// }

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/agregar", (req, res) => {
    const { nombre, precio } = req.query
    if (nombre == '' || !/^[a-zA-Z\s]+$/.test(nombre)) {
        return res.send("Ingrese un nombre válido")
    }

    if (isNaN(Number(precio)) || Number(precio) < 0) {
        return res.send("Ingrese un precio válido")
    }

    if (!leer().deportes.map(deporte => deporte.nombre).includes(nombre)) {
        agregar(nombre, precio)
        return res.sendStatus(200)
    }
    res.send("Ya existe el deporte")
})

app.get("/editar", (req, res) => {
    const { nombre, precio } = req.query;
    if (isNaN(Number(precio)) || Number(precio) < 0) {
        return res.send("Ingrese un precio válido")
    }
    editar(nombre, precio)
    res.sendStatus(200)


})

app.get("/eliminar/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    eliminar(nombre);
    res.sendStatus(200)
})

app.get("/deportes", (req, res) => {
    res.json(leer())
}
)