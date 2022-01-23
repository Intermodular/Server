const express = require("express");
const server = express();
const MongoClient = require("mongodb").MongoClient;
require("dotenv/config");



const employees = require("./routes/Employees");
const extras = require("./routes/Extras");
const mesas = require("./routes/Mesas");
const nominas = require("./routes/Nominas");
const pedidos = require("./routes/Pedidos");
const productos = require("./routes/Productos");
const zonas = require("./routes/Zonas");
const tipos = require("./routes/Tipos")

//bro mirar los users
let database;
const url =  "mongodb+srv://daniel:1234@cluster0.la1pl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"//

//Rutear las peticiones posts
server.use("/api",employees);
server.use("/api",extras);
server.use("/api",mesas);
server.use("/api",nominas);
server.use("/api",pedidos);
server.use("/api",productos);
server.use("/api",zonas);
server.use("/api",tipos);


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


server.listen(8080,()=>{
    console.log("Servidor iniciado");
});


function getDatabase(){
    return database;
}

exports.getDatabase = getDatabase;
