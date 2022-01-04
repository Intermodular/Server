const express = require("express");
const router = express.Router();
const app = require("../app");

router.use(express.json());

//Empleados
router.post("/empleado",async (req,res) => {
    saveDocument("Empleados",req.body,true,res,"Empleado insertado","Error al introducir empleado");
});

//Mesas
router.post("/mesa",async (req,res) => {
    saveDocument("Mesas",req.body,false,res,"Mesa insertada","Error al introducir mesa (_id duplicado)");
});

//Pedidos
router.post("/pedido",async (req,res) => {
    saveDocument("Pedidos",req.body,true,res,"Pedido insertado","Error al introducir pedido");
});

//Productos
router.post("/producto",async (req,res) => {
    saveDocument("Productos",req.body,true,res,"Producto insertado","Error al introducir producto");
});

//Nominas
router.post("/nomina",async (req,res) => {
    saveDocument("Nominas",req.body,true,res,"Nomina insertada","Error al introducir nomina");
});

//Extras
router.post("/extra",async (req,res) => {
    saveDocument("Extras",req.body,true,res,"Extra insertado","Error al introducir extra");
});

//Funciones auxiliares
async function saveDocument(collectionName,newDocument,autoIncrementId,response,succesMessage,errorMessage){
    let database = app.getDatabase();
    let collection = database.collection(collectionName);

    if(autoIncrementId){
        let listWithMaxId = await collection.find({}).sort({_id:-1}).limit(1).toArray();
        let id = listWithMaxId[0]._id + 1;
        newDocument._id = id;
    }

    collection.insertOne(newDocument, (err,result) => {
        if(err){
            console.log(errorMessage);
            response.sendStatus(403);
        }else{
            console.log(succesMessage);
            response.sendStatus(200);
        }
        
        response.end();
    });
}

router.post("/prueba",(req,res) => {
    console.log(req.body);
    console.log("POST");
    res.send("Empleado subido");
    res.end();
});

module.exports = router;