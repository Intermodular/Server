const express = require("express");
const router = express.Router();
const app = require("../app");

router.use(express.json());

//Empleados
router.put("/empleado",async (req,res) => {
    replaceInCollectionById("Empleados",req.body,res,"Empleado editado","No existe ningun empleado con ese id (Update)");
});

//Mesas
router.put("/mesa",async (req,res) => {
    replaceInCollectionById("Mesas",req.body,res,"Mesa editada","No existe ningua mesa con ese id (Update)");
});

//Pedidos
router.put("/pedido",async (req,res) => {
    replaceInCollectionById("Pedidos",req.body,res,"Pedido editado","No existe ningun pedido con ese id (Update)");
});

//Productos
router.put("/producto",async (req,res) => {
    replaceInCollectionById("Productos",req.body,res,"Producto editado","No existe ningun producto con ese id (Update)");
});

//Nominas
router.put("/nomina",async (req,res) => {
    replaceInCollectionById("Nominas",req.body,res,"Nomina editada","No existe ninguna nomina con ese id (Update)");
});

//Extras
router.put("/extra",async (req,res) => {
    replaceInCollectionById("Extras",req.body,res,"Extra editado","No existe ningun extra con ese id (Update)");
});

router.put("/prueba",(req,res) => {
    console.log(req.body);
    console.log(" (Put)")
    res.send("Empleado Actualizado");
    res.end();
});


//Funciones auxiliares
async function replaceInCollectionById(collectionName,newDocument,response,succesMessage,notFoundMessage){
    let db = app.getDatabase();
    let collection = db.collection(collectionName);
    const filter = {"_id":newDocument._id};
    collection.replaceOne(filter,newDocument,(err,result) => {
        if(err) throw err;
        if(result.modifiedCount != 0){
            response.sendStatus(200);
            console.log(succesMessage);
        }else{
            response.sendStatus(404);
            console.log(notFoundMessage);
        }
        response.end();
    });
}



module.exports = router;