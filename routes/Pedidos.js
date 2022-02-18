const { response } = require("express");
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

        savePedido(req.body,res);

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
router.delete("/pedido/id/:id/idMesa/:idMesa",async (req,res) => {
    pedido = {
        "_id":parseInt(req.params.id),
        "idMesa":parseInt(req.params.idMesa)
    };
    deletePedido(pedido,res);
});

//Aux 
async function savePedido(pedido,res){
    let database = app.getDatabase();
    let collection = database.collection("Pedidos");

    let documentWithId0 = await collection.findOne({"_id":0});
    let id;
    if(documentWithId0 == null){
        id = 0;
    }else{
        let listWithMaxId = await collection.find({}).sort({_id:-1}).limit(1).toArray();
        id = listWithMaxId[0]._id + 1;
    }

    pedido._id = id;
    
    collection.insertOne(pedido, (err,result) => {
        if(err){
            console.log("Error al insertar el pedido");
            res.sendStatus(403);
        }else{
            console.log("Pedido insertado");
            res.send("AsignedId=" + pedido._id);
            changeTableState(pedido.idMesa,"Ocupada");
        }
        
        res.end();
    });
}
async function deletePedido(pedido,res){
    let db = app.getDatabase();
    let collection = db.collection("Pedidos");
    let filter = {"_id":pedido._id};
    let deleteResult = await collection.deleteOne(filter);

    if(deleteResult.deletedCount == 1){
        res.sendStatus(200);
        console.log("Pedido Borrado");
        changeTableState(pedido.idMesa,"Libre");
    }else{
        res.sendStatus(404);
        console.log("Error al borrar el pedido");
    }
    res.end();
}

async function changeTableState(idMesa,estadoMesa){
    let database = app.getDatabase();
    let collection = database.collection("Mesas");
    collection.updateOne({_id:idMesa},{$set:{estado:estadoMesa}},(err,result) => {
        if(err){
            console.log("Error al cambiar el estado de la mesa");
        }else{
            console.log("Estado de la mesa actualizado a " + estadoMesa);
        }
    });
}

module.exports = router;
