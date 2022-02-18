const express = require("express");
const app = require("../app");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")


//Gets
router.get("/pedidos",async (req,res) => {
    list = await utils.getListFromCollection("Pedidos");
    res.send(list);
    res.end();
    console.log("Pedidos devueltos");
});

router.get("/pedido/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let pedido = await utils.getDocumentFromCollectionById("Pedidos",id);

    if(pedido != null){
        console.log("Pedido devuelto");
        res.send(pedido);
    }else{
        console.log("No hay ningun pedido con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

router.get("/pedido/idMesa/:idMesa",async (req,res) =>{
    let idMesa = parseInt(req.params.idMesa);
    let db = app.getDatabase();
    let collection = db.collection("Pedidos");
    let pedido = await collection.findOne({"idMesa":idMesa});

    if(pedido != null){
        console.log("Pedido devuelto");
        res.send(pedido);
    }else{
        console.log("No hay ningun pedido con ese idMesa (Get)");
        res.sendStatus(404);
    }
    res.end();
});
    



//Posts
router.post("/pedido",async (req,res) => {
    let db = app.getDatabase();
    let collection = db.collection("Pedidos");
    let pedido = await collection.findOne({"idMesa":req.body.idMesa});
    if(pedido == null){

        utils.saveDocument("Pedidos",req.body,true,res,"Pedido insertado","Error al introducir pedido");

    }else{
        res.send("Error idMesa repetido");
        res.end();
    }
    
});

//Puts
router.put("/pedido",async (req,res) => {
    utils.replaceInCollectionById("Pedidos",req.body,res,"Pedido editado","No existe ningun pedido con ese id (Update)");
});


//Delete
router.delete("/pedido/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Pedidos",parseInt(req.params.id),res,"Pedido eliminado","No hay ningun pedido con ese id (Delete)");
});


module.exports = router;
