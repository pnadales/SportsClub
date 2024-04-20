const fs = require("fs");
const express = require('express');
const app = express();
const PORT = 3000;

app.listen(3000, () => console.log("Servido iniciado en el puerto " + PORT));

//Lee un archivo json y lo retorna como objeto
function leer() {
    return JSON.parse(fs.readFileSync("deportes.json", "utf8"));
}

//Escribe el contenido pasado como parámetro en el archivo deportes.json
function actualizar(datos) {
    fs.writeFileSync("deportes.json", JSON.stringify({ "deportes": datos }))
}

//Agrega los datos recibidos al archivo json
function agregar(nombre, precio) {
    let datos = leer().deportes
    datos.push({ "nombre": nombre, "precio": precio })
    actualizar(datos)
}

//Actualiza el contenido del archivo json son los datos recibidos
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

//Elimina los datos recibidos del archivo json
function eliminar(nombre) {
    let datos = leer().deportes
    let noEliminados = datos.filter(deporte => deporte.nombre != nombre)
    actualizar(noEliminados)
}

// Ruta raíz con la página principal del sitio 
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

//Ruta para agregar los datos recibidos desde le front
app.get("/agregar", (req, res) => {
    //Se capturan los parametros de la ruta
    const { nombre, precio } = req.query
    //Validació para que el nombre no sea vacío y solo contenga carácteres numéricos
    if (nombre == '' || !/^[a-zA-Z\s]+$/.test(nombre)) {
        return res.send("Ingrese un nombre válido")
    }
    //Validación para que el precio sea un número y no sea negativo
    if (isNaN(Number(precio)) || Number(precio) < 0) {
        return res.send("Ingrese un precio válido")
    }
    //Validación para no repetir deportes
    if (!leer().deportes.map(deporte => deporte.nombre).includes(nombre)) {
        agregar(nombre, precio)
        return res.sendStatus(200)
    }
    res.send("Ya existe el deporte")
})

//Ruta para editar con los datos recibidos desde el front
app.get("/editar", (req, res) => {
    //Se capturan los parametros de la ruta
    const { nombre, precio } = req.query;
    //Validación para que el precio sea un número y no sea negativo
    if (isNaN(Number(precio)) || Number(precio) < 0) {
        return res.send("Ingrese un precio válido")
    }
    editar(nombre, precio)
    res.sendStatus(200)


})

//Ruta para eliminar según lo recibido desde el front
app.get("/eliminar/:nombre", (req, res) => {
    //Se captura el parametro de la ruta
    const nombre = req.params.nombre;
    eliminar(nombre);
    res.sendStatus(200)
})

//Ruta que retorna el contenido json del archivo deportes
app.get("/deportes", (req, res) => {
    res.json(leer())
}
)

//Ruta genérica
app.get('*', (req, res) => {
    res.send('Ruta inválida :c\n <a href="/"><button>Ir al inicio</button></a>')
})