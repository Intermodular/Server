const express = require("express");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")

//Gets
router.get("/nominas",async (req,res) => {
    list = await utils.getListFromCollection("Nominas");
    res.send(list);
    res.end();
    console.log("Nominas devueltas");
});

router.get("/nomina/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let nomina = await utils.getDocumentFromCollectionById("Nominas",id);

    if(nomina != null){
        console.log("Nomina devuelta");
        res.send(nomina);
    }else{
        console.log("No hay ninguna nomina con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Posts
router.post("/nomina",async (req,res) => {
    utils.saveDocument("Nominas",req.body,true,res,"Nomina insertada","Error al introducir nomina");
});

//Puts
router.put("/nomina",async (req,res) => {
    replaceInCollectionById("Nominas",req.body,res,"Nomina editada","No existe ninguna nomina con ese id (Update)");
});

//Deletes
router.delete("/nomina/id/:id",async (req,res) => {
    deleteFromCollectionById("Nominas",parseInt(req.params.id),res,"Nomina eliminada","No hay ninguna nomina con ese id (Delete)");    
});

module.exports = router;
