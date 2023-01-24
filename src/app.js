const http = require('http');
const {createReadStream, readFile, writeFile} = require('fs');
const path_db = "./src/db.json";

const PORT = process.env.PORT || 3000;


// Servidor HTTP.
const server = http.createServer((req, res) => {
    req.method === "GET" ? requestGET(req, res):
    req.method === "POST" ? requestPOST(req, res):
    req.method === "PUT" ? requestPUT(req, res):
    req.method === "DELETE" ? requestDELETE(req, res):
    res.end('No hay respuesta a este tipo de peticion.')
})
server.listen(PORT, () => {});



// Maneja las peticiones GET.
function  requestGET(req, res) {
    if (req.url === "/") {
        res.setHeader('Content-type', 'text/html');
        createReadStream('./src/static/index.html').pipe(res);
    }

    else if (req.url === "/main.css") {
        res.setHeader('Content-type', 'text/css');
        createReadStream('./src/static/main.css').pipe(res);
    }

    else if (req.url === "/script.js") {
        res.setHeader('Content-type', 'application/javascript');
        createReadStream('./src/static/script.js').pipe(res);
    }

    else if (req.url === "/getNotes") {
        res.setHeader('Content-type', 'application/json');
        createReadStream('./src/db.json').pipe(res);
    }

    else {res.end("La ruta especificada no existe.")}
}



function  requestPOST(req, res) {
    if (req.url === "/setNote") {
        let note = '';
        req.on("data", data => { note += data; })
        req.on('end', () => {
            note = JSON.parse(note);
            readFile(path_db, "utf-8", (err, content) => {
                const db = JSON.parse(content);
                note.id = db.length;
                db.notes[db.length] = note;
                db.length++;
                writeFile(path_db, JSON.stringify(db), () => {});
                res.end(JSON.stringify({id: note.id}));
            })
        })
    }
    else {res.end("La ruta especificada no existe.")}
}



function requestPUT(req, res) {
    if (req.url === "/updateNote") {
        let note = '';
        req.on("data", data => { note += data; })
        req.on('end', () => {
            note = JSON.parse(note);
            readFile(path_db, "utf-8", (err, content) => {
                const db = JSON.parse(content);
                delete db.notes[note.id]
                note.id = db.length;
                db.notes[db.length] = note;
                db.length++;
                writeFile(path_db, JSON.stringify(db), () => {});
                res.end(JSON.stringify({id: note.id}));
            })
        })
    }

    else {res.end("La ruta especificada no existe.")}
}



function requestDELETE(req, res) {
    if (req.url === "/deleteNote") {
        let id = '';
        req.on("data", data => { id += data; })
        req.on('end', () => {
            id = JSON.parse(id).id;

            readFile(path_db, "utf-8", (err, content) => {
                const db = JSON.parse(content);
                delete db.notes[id]
                writeFile(path_db, JSON.stringify(db), () => {});
            })
            res.end(JSON.stringify({delete: true}));
        })
    }
}