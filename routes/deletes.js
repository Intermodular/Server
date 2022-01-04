const express = require("express");
const router = express.Router();
const app = require("../app");

router.use(express.json());

//Empleados
router.delete("/empleado/id/:id",async (req,res) => {
    deleteFromCollectionById("Empleados",parseInt(req.params.id),res,"Empleado eliminado","No hay ningun empleado con ese id (Delete)");
});

//Mesas
router.delete("/mesa/id/:id",async (req,res) => {
    deleteFromCollectionById("Mesas",parseInt(req.params.id),res,"Mesa eliminada","No hay ninguna mesa con ese id (Delete)");
});

//Pedidos
router.delete("/pedido/id/:id",async (req,res) => {
    deleteFromCollectionById("Pedidos",parseInt(req.params.id),res,"Pedido eliminado","No hay ningun pedido con ese id (Delete)");
});

//Productos
router.delete("/producto/id/:id",async (req,res) => {
    deleteFromCollectionById("Productos",parseInt(req.params.id),res,"Producto eliminado","No hay ningun producto con ese id (Delete)");   
});

//Nominas
router.delete("/nomina/id/:id",async (req,res) => {
    deleteFromCollectionById("Nominas",parseInt(req.params.id),res,"Nomina eliminada","No hay ninguna nomina con ese id (Delete)");    
});

//Extras
router.delete("/extra/id/:id",async (req,res) => {
    deleteFromCollectionById("Extras",parseInt(req.params.id),res,"Extra eliminado","No hay ningun extra con ese id (Delete)");
});

router.delete("/prueba/id/:id",(req,res) => {
    console.log("Empleado con id " + req.params.id + " borrado");
    console.log(" (Delete)")
    res.send("Empleado borrado con id " +  req.params.id);
    res.end();
});


//Funciones auxiliares
async function deleteFromCollectionById(collectionName,id,response,succesMessage,notFoundMessage){
    let db = app.getDatabase();
    let collection = db.collection(collectionName);
    let filter = {"_id":id};
    let deleteResult = await collection.deleteOne(filter);

    if(deleteResult.deletedCount == 1){
        response.sendStatus(200);
        console.log(succesMessage);
    }else{
        response.sendStatus(404);
        console.log(notFoundMessage);
    }
    response.end();
}


module.exports = router;