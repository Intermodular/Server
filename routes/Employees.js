const express = require("express");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils")

//Gets
router.get("/empleados",async (req,res) => {
    list = await utils.getListFromCollection("Empleados");
    res.send(list);
    res.end();
    console.log("Empleados devueltos");
});

router.get("/empleado/id/:id",async (req,res) => {
    let id = parseInt(req.params.id)
    let empleado = await utils.getDocumentFromCollectionById("Empleados",id);

    if(empleado != null){
        console.log("Empleado devuelto");
        res.send(empleado);
    }else{
        console.log("No hay ningun empleado con ese id (Get)");
        res.sendStatus(404);
    }
    res.end();
});

//Posts
router.post("/empleados",async (req,res) => {
    utils.saveDocument("Empleados",req.body,true,res,"Empleado insertado","Error al introducir empleado");
});

//Puts
router.put("/empleado",async (req,res) => {
    utils.replaceInCollectionById("Empleados",req.body,res,"Empleado editado","No existe ningun empleado con ese id (Update)");
});

//Deletes
router.delete("/empleado/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Empleados",parseInt(req.params.id),res,"Empleado eliminado","No hay ningun empleado con ese id (Delete)");
});



module.exports = router;
