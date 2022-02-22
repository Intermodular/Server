const express = require("express");
const app = require("../app");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils");

//Gets
router.get("/reservas/dia/:anyo/:mes/:dia" ,async (req,res) =>{
    let collection = app.getDatabase().collection("Reservas");
    //pillar una hora del dia de antes y una  del dia despues (que llegue hasta las 23:00 del dia anterior y hasta la 1:00 del dia despues para que cuenten las reservas cerca de las 12pm)
    let tiempoEnMin =  new Date(parseInt(req.params.anyo),parseInt(req.params.mes),parseInt(req.params.dia),0,0,0,0).getTime() / 60000;
    console.log(tiempoEnMin);
    let lowerInterval = tiempoEnMin - 60;
    console.log(lowerInterval);
    let topInterval = tiempoEnMin + 25 * 60;
    console.log(topInterval);
    let cursor = await collection.find({totalMinutos:{"$gt":lowerInterval,"$lt":topInterval}});
    let list = await cursor.toArray();
    res.send(list);
    res.end();

});

router.get("/reservas/minuto/:anyo/:mes/:dia/:hora/:minuto", async (req,res) =>{
    //Pilla todas las reservas una hora antes y 20 minutos despues
    let marginTop = 120;
    let marginBot = 20;
    let collection = app.getDatabase().collection("Reservas");
    let tiempoEnMin = new Date(parseInt(req.params.anyo),parseInt(req.params.mes),parseInt(req.params.dia),parseInt(req.params.hora),parseInt(req.params.minuto),0,0).getTime() / 60000;
    let cursor = await collection.find({totalMinutos:{"$gt":tiempoEnMin - marginBot,"$lt":tiempoEnMin + marginTop}});
    let list = await cursor.toArray();
    res.send(list);
    res.end();
})

router.get("/reservas/minutoReservar/:anyo/:mes/:dia/:hora/:minuto", async (req,res) =>{
    let marginTop = 120;
    let marginBot = 120;
    let collection = app.getDatabase().collection("Reservas");
    let tiempoEnMin = new Date(parseInt(req.params.anyo),parseInt(req.params.mes),parseInt(req.params.dia),parseInt(req.params.hora),parseInt(req.params.minuto),0,0).getTime() / 60000;
    let cursor = await collection.find({totalMinutos:{"$gt":tiempoEnMin - marginBot,"$lt":tiempoEnMin + marginTop}});
    let list = await cursor.toArray();
    res.send(list);
    res.end();
});

router.get("/reservas", async (req,res) =>{
    list = await utils.getListFromCollection("Reservas");
    res.send(list);
    res.end();
    console.log("Todas las Reservas devueltas");
})

//Posts
router.post("/reserva",async (req,res)=>{
    
    let reservaApp = req.body;
    let reservaBDDS = reservaApp;
    reservaBDDS.totalMinutos = new Date(reservaApp.anyo,reservaApp.mes,reservaApp.dia,reservaApp.hora,reservaApp.minuto,0,0).getTime() / 60000;

    if(await canReserve(reservaBDDS.idMesa,reservaBDDS.totalMinutos)){

        let collection = app.getDatabase().collection("Reservas");
    
        let documentWithId0 = await collection.findOne({"_id":0});
        let id;
        if(documentWithId0 == null){
            id = 0;
        }else{
            let listWithMaxId = await collection.find({}).sort({_id:-1}).limit(1).toArray();
            id = listWithMaxId[0]._id + 1;
        }

        reservaBDDS._id = id

        await collection.insertOne(reservaBDDS,(err,result) =>{
            if(err){
                console.log("Error al insertar reserva");
                res.sendStatus(403);
                res.end();
            }else{
                console.log("Reserva insertada");
                res.sendStatus(200);
                res.end();
            }
        });

    }else{

        console.log("Error al insertar reserva.Mesa ya ocupada");
        res.send("Error reserva ocupada");
        res.end();
    }
    
    
});
//Updates
router.put("/reserva",async (req,res) => {
    let reserva = req.body;
    reserva.totalMinutos = new Date(reserva.anyo,reserva.mes,reserva.dia, reserva.hora,reserva.minuto,0,0).getTime() / 60000;
    if(await canReserveWithIdException(reserva._id,reserva.idMesa,reserva.totalMinutos)){
        let collection = app.getDatabase().collection("Reservas");
        collection.replaceOne({_id:reserva._id},reserva,(err,result) =>{
            if(err){
                console.log("Error al actualizar la reserva");
                res.sendStatus(403);
                res.end();
                
            }else{
                console.log("Reserva actualizada");
                res.sendStatus(200);
                res.end();
            }
        });
    }else{
        console.log("Error al insertar reserva.Mesa ya ocupada");
        res.send("Error reserva ocupada");
        res.end();
    }
});

//Deletes
router.delete("/reserva/id/:id",async (req,res) =>{
    utils.deleteFromCollectionById("Reservas",parseInt(req.params.id),res,"Reserva eliminada","No hay ninguna reserva con ese id (Delete)")
});


router.delete("/reserva/allExpired/minute/:anyo/:mes/:dia/:hora/:minuto",async(req,res) => {
    let collection = app.getDatabase().collection("Reservas");
    let marginBot = 20;
    let tiempoEnMin = new Date(parseInt(req.params.anyo),parseInt(req.params.mes),parseInt(req.params.dia),parseInt(req.params.hora),parseInt(req.params.minuto),0,0).getTime() / 60000;
    let deleteResult = await collection.deleteMany({totalMinutos:{"$lt":tiempoEnMin - marginBot}});
    
    if(deleteResult.deletedCount > 0){
        res.sendStatus(200);
        console.log("Se han eliminado " +  deleteResult.deletedCount + " reservas");
    }else{
        res.sendStatus(404);
        console.log("No se ha eliminado ninguna reserva");
    }
    res.end();
});




//Aux 
async function canReserve(id_mesa,minutos){
    let collection = app.getDatabase().collection("Reservas");
    let marginTop = 120;
    let marginBot = 120;
    
    let reserva = await collection.findOne({idMesa:id_mesa,totalMinutos:{"$gt":minutos - marginBot,"$lt":minutos + marginTop}});
    if(reserva == null){
        return true;
    }
    return false;
}

async function canReserveWithIdException(id_ignore,id_mesa,minutos){
    let collection = app.getDatabase().collection("Reservas");
    let marginTop = 120;
    let marginBot = 120;
    
    let reserva = await collection.findOne({_id:{$ne:id_ignore},idMesa:id_mesa,totalMinutos:{"$gt":minutos - marginBot,"$lt":minutos + marginTop}});
    if(reserva == null){
        return true;
    }
    return false;
}
module.exports = router;