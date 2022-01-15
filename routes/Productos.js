const express = require("express");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")


//Productos
router.get("/productos",async (req,res) => {
    list = await utils.getListFromCollection("Productos");
    res.send(list);
    res.end();
    console.log("Productos devueltos");
});

router.get("/producto/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let producto = await utils.getDocumentFromCollectionById("Productos",id);

    if(producto != null){
        console.log("Producto devuelto");
        res.send(producto);
    }else{
        console.log("No hay ningun producto con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Posts
router.post("/producto",async (req,res) => {
    utils.saveDocument("Productos",req.body,true,res,"Producto insertado","Error al introducir producto");
});

//Puts
router.put("/producto",async (req,res) => {
    utils.replaceInCollectionById("Productos",req.body,res,"Producto editado","No existe ningun producto con ese id (Update)");
});

//Deletes
router.delete("/producto/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Productos",parseInt(req.params.id),res,"Producto eliminado","No hay ningun producto con ese id (Delete)");   
});

module.exports = router;
