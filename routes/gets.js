const express = require("express");
const router = express.Router();
const app = require("../app");

router.use(express.json());

//Empleados
router.get("/empleados",async (req,res) => {
    list = await getListFromCollection("Empleados");
    res.send(list);
    res.end();
    console.log("Empleados devueltos");
});

router.get("/empleado/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let empleado = await getDocumentFromCollectionById("Empleados",id);

    if(empleado != null){
        console.log("Empleado devuelto");
        res.send(empleado);
    }else{
        console.log("No hay ningun empleado con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Mesas
router.get("/mesas",async (req,res) => {
    list = await getListFromCollection("Mesas");
    res.send(list);
    res.end();
    console.log("Mesas devueltas");
});

router.get("/mesa/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let mesa = await getDocumentFromCollectionById("Mesas",id);

    if(mesa != null){
        console.log("Mesa devuelta");
        res.send(mesa);
    }else{
        console.log("No hay ninguna mesa con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Pedidos
router.get("/pedidos",async (req,res) => {
    list = await getListFromCollection("Pedidos");
    res.send(list);
    res.end();
    console.log("Pedidos devueltos");
});

router.get("/pedido/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let pedido = await getDocumentFromCollectionById("Pedidos",id);

    if(pedido != null){
        console.log("Pedido devuelto");
        res.send(pedido);
    }else{
        console.log("No hay ningun pedido con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Productos
router.get("/productos",async (req,res) => {
    list = await getListFromCollection("Productos");
    res.send(list);
    res.end();
    console.log("Productos devueltos");
});

router.get("/producto/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let producto = await getDocumentFromCollectionById("Productos",id);

    if(producto != null){
        console.log("Producto devuelto");
        res.send(producto);
    }else{
        console.log("No hay ningun producto con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Nominas
router.get("/nominas",async (req,res) => {
    list = await getListFromCollection("Nominas");
    res.send(list);
    res.end();
    console.log("Nominas devueltas");
});

router.get("/nomina/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let nomina = await getDocumentFromCollectionById("Nominas",id);

    if(nomina != null){
        console.log("Nomina devuelta");
        res.send(nomina);
    }else{
        console.log("No hay ninguna nomina con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Extras
router.get("/extras",async (req,res) => {
    list = await getListFromCollection("Extras");
    res.send(list);
    res.end();
    console.log("Extras devueltos");
});

router.get("/extra/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let extra = await getDocumentFromCollectionById("Extras",id);

    if(extra != null){
        console.log("Extra devuelto");
        res.send(extra);
    }else{
        console.log("No hay ningun extra con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Funciones auxiliares
async function getListFromCollection(collectionName){
    let database = app.getDatabase();
    let collection = database.collection(collectionName);
    let cursor = await collection.find({});
    let list = await cursor.toArray();
    return list; 
}

async function getDocumentFromCollectionById(collectionName,id){
    let database = app.getDatabase();
    let collection = database.collection(collectionName);
    let empleado = await collection.findOne({"_id":id});
    return empleado;
}

router.get("/pruebaLista",(req,res) => {
    let objs = [
        {
            "_id":1,
            "nombre":"Samira",
            "apellido":"Munoz",
            "dni":"49233248T",
            "fnac":"03-10-1998",
            "usuario":"mun0310",
            "password":"hola",
            "rol":"admin"
        },
        {
            "_id":2,
            "nombre":"Simon",
            "apellido":"Baldo",
            "dni":"49233248T",
            "fnac":"03-10-1998",
            "usuario":"mun0310",
            "password":"hola",
            "rol":"admin"
        },
        {
            "_id":3,
            "nombre":"Marge",
            "apellido":"Simpson",
            "dni":"49233248T",
            "fnac":"03-10-1998",
            "usuario":"mun0310",
            "password":"hola",
            "rol":"admin"
        }
    ];

    console.log("Te lo paso");
    res.set("Content-Type","application/json");
    res.send(objs);
    res.end();
});

router.get("/prueba",(req,res) => {
    let obj =
        {   "_id":1,
            "nombre":"Samira",
            "apellido":"Munoz",
            "dni":"49233248T",
            "fnac":"03-10-1998",
            "usuario":"mun0310",
            "password":"hola",
            "rol":"admin"
        }

    res.set("Content-Type","application/json");
    res.send(obj);
    res.end();
});

module.exports = router;
