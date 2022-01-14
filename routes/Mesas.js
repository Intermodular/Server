const express = require("express");
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

//Post
router.post("/mesa",async (req,res) => {
    utils.saveDocument("Mesas",req.body,false,res,"Mesa insertada","Error al introducir mesa (_id duplicado)");
});

//Puts
router.put("/mesa",async (req,res) => {
    replaceInCollectionById("Mesas",req.body,res,"Mesa editada","No existe ningua mesa con ese id (Update)");
});

//Delete
router.delete("/mesa/id/:id",async (req,res) => {
    deleteFromCollectionById("Mesas",parseInt(req.params.id),res,"Mesa eliminada","No hay ninguna mesa con ese id (Delete)");
});


module.exports = router;
