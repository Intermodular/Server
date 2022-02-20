const express = require("express");
const app = require("../app");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")


//Gets
router.get("/mesas",async (req,res) => {
    list = await utils.getListFromCollection("Mesas");
    res.send(list);
    res.end();
    console.log("Mesas devueltas");
});

router.get("/mesa/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let mesa = await utils.getDocumentFromCollectionById("Mesas",id);

    if(mesa != null){
        console.log("Mesa devuelta");
        res.send(mesa);
    }else{
        console.log("No hay ninguna mesa con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

router.get("/mesa/numero/:numero",async (req,res) => {
    let database = app.getDatabase();
    let collection = database.collection("Mesas");
    const mesa = await collection.findOne({numero:parseInt(req.params.numero)});
    if(mesa == null){
        res.sendStatus(404);
        console.log("Mesa not found");

    }else{
        res.send(mesa);
        console.log("Mesa devuelto");
    }
    res.end();
});

//Post
router.post("/mesa",async (req,res) => {
    saveMesa(req.body,res);
});

//Puts
router.put("/mesa",async (req,res) => {
    utils.replaceInCollectionById("Mesas",req.body,res,"Mesa editada","No existe ningua mesa con ese id (Update)");
});

//Delete
router.delete("/mesa/id/:id",async (req,res) => {
    deleteMesa(req.params.id, res)
});

async function saveMesa(mesa, res) {    
    let db = app.getDatabase();
    let collection = db.collection("Mesas");

    let documentWithId0 = await collection.findOne({"_id":0});
    let id;
    if(documentWithId0 == null){
        id = 0;
    }else{
        let listWithMaxId = await collection.find({}).sort({_id:-1}).limit(1).toArray();
        id = listWithMaxId[0]._id + 1;
    }
    mesa._id = id;

    collection.insertOne(mesa, (err,result) => {
        if(err){
            console.log("Error al insertar Mesa");
            res.sendStatus(403);
        }else{
            utils.updateZoneOnTableCollectionChange(mesa, res);
            console.log("Mesa insertada");            
            res.send("AsignedId=" + mesa._id);
        }
        
        res.end();
    });
}

async function deleteMesa(mesaId,res){
    let db = app.getDatabase();
    let collection = db.collection("Mesas");
    let mesa = await collection.findOne({"_id":parseInt(mesaId)});
    console.log(mesa);
    let deleteResult = await collection.deleteOne({"_id":parseInt(mesaId)});

    if(deleteResult.deletedCount == 1){
        utils.updateZoneOnTableCollectionChange(mesa, res);
        res.sendStatus(200);
        console.log("Mesa eliminada");
    }else{
        res.sendStatus(404);
        console.log("La mesa no se ha eliminado");
    }
    res.end();
}

module.exports = router;
