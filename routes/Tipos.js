const express = require("express");
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
    utils.replaceInCollectionById("Tipos",req.body,res,"Tipo editado","No existe ningun tipo con ese id (Update)");
});


//Delete
router.delete("/tipo/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Tipos",parseInt(req.params.id),res,"Tipo eliminado","No hay ningun tipo con ese id (Delete)");
});








module.exports = router;
