const express = require("express");
const server = express();
const MongoClient = require("mongodb").MongoClient;
require("dotenv/config");
const postsRouter = require("./routes/posts");
const getsRouter = require("./routes/gets");
const putsRouter = require("./routes/puts");
const deletesRouter = require("./routes/deletes");
let database;
const url = process.env.DB_CONNECTION;

//Rutear las peticiones posts
server.use("/api",postsRouter);
server.use("/api",getsRouter);
server.use("/api",putsRouter);
server.use("/api",deletesRouter);

//Conectar base de datos
MongoClient.connect(url,(err,db)=>{
    if(err){
        console.log("No se ha podido conectar a la base de datos");
        //throw err;
    }else{
        console.log("Conectado a la base de datos");
        database = db.db("BDEros");
    } 
});

//Peter

server.listen(8080,()=>{
    console.log("Servidor iniciado");
});

//Pocholo
//2

function getDatabase(){
    return database;
}

exports.getDatabase = getDatabase;
