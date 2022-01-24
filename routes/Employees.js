const express = require("express");
const app = require("../app");
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

router.get("/empleado/usuario/:usuario",async (req,res) => {
    let database = app.getDatabase();
    let collection = database.collection("Empleados");
    const empleado = await collection.findOne({usuario:req.params.usuario});
    if(empleado == null){
        res.sendStatus(404);
        console.log("Empleado not found")

    }else{
        res.send(empleado);
        console.log("Empleado devuelto");
    }
    res.end();
});

//Posts
router.post("/empleado",async (req,res) => {
    if(await utils.checkUserNameFromEmployeeExists(req.body)){
        res.send("Error Usuario Ya Existe");
        console.log("Error Usuario Ya Existe")
        res.end();
    }else{
        utils.saveDocument("Empleados",req.body,true,res,"Empleado insertado","Error al introducir empleado");
    }
    
    
});

//Puts
router.put("/empleado",async (req,res) => {
    if(await utils.checkUserNameFromEmployeeExists(req.body)){
        res.send("Error Usuario Ya Existe");
        console.log("Error Usuario con id" + req.body._id +" Ya Existe")
        res.end();
    }else{
        utils.replaceInCollectionById("Empleados",req.body,res,"Empleado editado","No existe ningun empleado con ese id (Update)");
    }
});

//Deletes
router.delete("/empleado/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Empleados",parseInt(req.params.id),res,"Empleado eliminado","No hay ningun empleado con ese id (Delete)");
});






module.exports = router;
