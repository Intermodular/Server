const express = require("express");
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
    utils.replaceInCollectionById("Zonas",req.body,res,"Zona editada","No existe ninguna zona con ese id (Update)");
});


//Delete
router.delete("/zona/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Zonas",parseInt(req.params.id),res,"Zona eliminada","No hay ninguna zona con ese id (Delete)");
});








module.exports = router;
