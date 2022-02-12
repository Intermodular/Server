const express = require("express");
const app = require("../app");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")


//Gets
router.get("/tickets",async (req,res) => {
    list = await utils.getListFromCollection("Tickets");
    res.send(list);
    res.end();
    console.log("Tickets devueltos");
});

router.get("/ticket/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let ticket = await utils.getDocumentFromCollectionById("Tickets",id);

    if(ticket != null){
        console.log("Ticket devuelto");
        res.send(ticket);
    }else{
        console.log("No hay ningun ticket con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});


//Posts
router.post("/ticket",async (req,res) => {
    utils.saveDocument("Tickets",req.body,true,res,"Ticket insertado","Error al introducir ticket");
});

//Puts
router.put("/ticket",async (req,res) => {
    utils.replaceInCollectionById("Tickets",req.body,res,"Ticket editado","No existe ningun ticket con ese id (Update)");
});


//Delete
router.delete("/ticket/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Tickets",parseInt(req.params.id),res,"Ticket eliminado","No hay ningun ticket con ese id (Delete)");
});

module.exports = router;