const express = require("express");
const app = require("../app");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")


//Gets
router.get("/tipos",async (req,res) => {
    list = await utils.getListFromCollection("Tipos");
    res.send(list);
    res.end();
    console.log("Tipos devueltos");
});

router.get("/tipo/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let pedido = await utils.getDocumentFromCollectionById("Tipos",id);

    if(pedido != null){
        console.log("Tipo devuelto");
        res.send(pedido);
    }else{
        console.log("No hay ningun tipo con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});


//Posts
router.post("/tipo",async (req,res) => {
    utils.saveDocument("Tipos",req.body,true,res,"Tipo insertado","Error al introducir tipo");
});

//Puts
router.put("/tipo",async (req,res) => {
    updateTipoAndProductos(req.body, res);
});


//Delete
router.delete("/tipo/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Tipos",parseInt(req.params.id),res,"Tipo eliminado","No hay ningun tipo con ese id (Delete)");
});

async function updateTipoAndProductos(tipo, res){
    let db = app.getDatabase();
    let tipos = db.collection("Tipos");
    let productos = db.collection("Productos");
    let oldTipo = await tipos.findOne({"_id": tipo._id});
    tipos.replaceOne({"_id":tipo._id}, tipo, (err,result) => {
        if(err) throw err;
        if(result.modifiedCount != 0){
            productos.update({"tipo":oldTipo.nombre}, {$set: {"tipo": tipo.nombre}});
            res.sendStatus(200);
            console.log("El tipo se ha actualizado");
        }else{
            res.sendStatus(404);
            console.log("El tipo no se ha podido actualizar");
        }
        res.end();
    });
}

module.exports = router;
