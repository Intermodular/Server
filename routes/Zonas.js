const express = require("express");
const req = require("express/lib/request");
const app = require("../app");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")


//Gets
router.get("/zonas",async (req,res) => {
    list = await utils.getListFromCollection("Zonas");
    res.send(list);
    res.end();
    console.log("Zonas devueltas");
});

router.get("/zona/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let pedido = await utils.getDocumentFromCollectionById("Zonas",id);

    if(pedido != null){
        console.log("Zona devuelta");
        res.send(pedido);
    }else{
        console.log("No hay ningun pedido con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});


//Posts
router.post("/zona",async (req,res) => {
    utils.saveDocument("Zonas",req.body,true,res,"Zona insertada","Error al introducir zona");
});

//Puts
router.put("/zona",async (req,res) => {
    updateZoneAndTables(req.body, res);
});


//Delete
router.delete("/zona/id/:id",async (req,res) => {
    deleteZoneAndTables(parseInt(req.params.id), res);
});

async function updateZoneAndTables(zona, res){
    let db = app.getDatabase();
    let zonas = db.collection("Zonas");
    let mesas = db.collection("Mesas");
    let oldZona = await zonas.findOne({"_id": zona._id});
    zonas.replaceOne({"_id":zona._id}, zona, (err,result) => {
        if(err) throw err;
        if(result.modifiedCount != 0){
            mesas.update({"zona":oldZona.nombre}, {$set: {"zona": zona.nombre}});
            res.sendStatus(200);
            console.log("La zona se ha actualizado");
        }else{
            res.sendStatus(404);
            console.log("La zona no se ha podido actualizar");
        }
        res.end();
    });
}

async function deleteZoneAndTables(zonaId, res){
    let db = app.getDatabase();
    let collection = db.collection("Zonas");
    let zona = await collection.findOne({"_id":zonaId});
    let deleteResult = await collection.deleteOne({"_id":zonaId});

    if(deleteResult.deletedCount == 1){
        await db.collection("Mesas").remove({"zona":zona.nombre})
        res.sendStatus(200);
        console.log("Zona eliminada correctamente");
    }else{
        res.sendStatus(404);
        console.log("La zona no se ha podido eliminar");
    }
    res.end();
}

module.exports = router;
