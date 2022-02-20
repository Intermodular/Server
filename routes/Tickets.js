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
    saveTicketAndUpdateStock(req.body,res);
});

//Puts
router.put("/ticket",async (req,res) => {
    utils.replaceInCollectionById("Tickets",req.body,res,"Ticket editado","No existe ningun ticket con ese id (Update)");
});


//Delete
router.delete("/ticket/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Tickets",parseInt(req.params.id),res,"Ticket eliminado","No hay ningun ticket con ese id (Delete)");
});

//Aux

async function saveTicketAndUpdateStock(ticket,res){
    
    let database = app.getDatabase();
    let collection = database.collection("Tickets");

    let documentWithId0 = await collection.findOne({"_id":0});
    let id;
    if(documentWithId0 == null){
        id = 0;
    }else{
        let listWithMaxId = await collection.find({}).sort({_id:-1}).limit(1).toArray();
        id = listWithMaxId[0]._id + 1;
    }

    ticket._id = id;
    
    collection.insertOne(ticket, (err,result) => {
        if(err){
            console.log("Error al insertar el ticket");
            res.sendStatus(403);
        }else{
            subtractStock(ticket);
            console.log("Ticket insertado y stock actualizado");
            res.send("AsignedId=" + ticket._id);
            
        }
        
        res.end();
    });
    
}

async function subtractStock(ticket){
    let collection = app.getDatabase().collection("Productos")
    ticket.lineasPedido;
    ticket.lineasPedido.forEach(async (lineaPedido) => {
        await collection.updateOne({"_id":lineaPedido.producto._id},{"$inc":{"stock":-lineaPedido.cantidad}});
        lineaPedido.producto
    });
}

module.exports = router;