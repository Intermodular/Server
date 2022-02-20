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
        updateEmpleadoAndNominas(req.body,res);
    }
});

//Deletes
router.delete("/empleado/id/:id",async (req,res) => {
    utils.deleteFromCollectionById("Empleados",parseInt(req.params.id),res,"Empleado eliminado","No hay ningun empleado con ese id (Delete)");
});

async function updateEmpleadoAndNominas(empleado,response){
    let db = app.getDatabase();
    let empleados = db.collection("Empleados");
    let nominas = db.collection("Nominas");
    console.log(empleado);
    let oldEmpleado = await empleados.findOne({"_id":empleado._id});
    empleados.replaceOne({"_id":empleado._id},empleado,(err,result) => {
        if(err) throw err;
        if(result.modifiedCount != 0){
            nominas.updateMany({"idEmpleado":oldEmpleado._id},
            {$set: {"apellidoEmpleado":empleado.apellido, "nombreEmpleado": empleado.nombre, "dniEmpleado":empleado.dni, "direccionEmpleado":empleado.dir}}),
            response.sendStatus(200);
            console.log("Empleado editado, nominas actualizadas");
        }else{
            response.sendStatus(404);
            console.log("No existe ningun empleado con ese id (Update)");
        }
        response.end();
    });
}

module.exports = router;
