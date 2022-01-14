const express = require("express");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")

//Gets
router.get("/extras",async (req,res) => {
    list = await utils.getListFromCollection("Extras");
    res.send(list);
    res.end();
    console.log("Extras devueltos");
});

router.get("/extra/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let extra = await utils.getDocumentFromCollectionById("Extras",id);

    if(extra != null){
        console.log("Extra devuelto");
        res.send(extra);
    }else{
        console.log("No hay ningun extra con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Posts
router.post("/extra",async (req,res) => {
    utils.saveDocument("Extras",req.body,true,res,"Extra insertado","Error al introducir extra");
});

//Puts
router.put("/extra",async (req,res) => {
    replaceInCollectionById("Extras",req.body,res,"Extra editado","No existe ningun extra con ese id (Update)");
});

//Deletes
router.delete("/extra/id/:id",async (req,res) => {
    deleteFromCollectionById("Extras",parseInt(req.params.id),res,"Extra eliminado","No hay ningun extra con ese id (Delete)");
});

module.exports = router;
