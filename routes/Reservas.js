const express = require("express");
const app = require("../app");
const router = express.Router();
router.use(express.json());
const utils = require("./Utils");

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
    let marginToTop = 60;
    let marginBot = 20;
    let collection = app.getDatabase().collection("Reservas");
    let tiempoEnMin = new Date(parseInt(req.params.anyo),parseInt(req.params.mes),parseInt(req.params.dia),parseInt(req.params.hora),parseInt(req.params.minuto),0,0).getTime() / 60000;
    let cursor = await collection.find({totalMinutos:{"$gt":tiempoEnMin - marginBot,"$lt":tiempoEnMin + marginToTop}});
    let list = await cursor.toArray();
    res.send(list);
    res.end();
})


router.post("/reserva",async (req,res)=>{
    
    let reservaApp = req.body;
    let reservaBDDS = reservaApp;
    reservaBDDS.totalMinutos = new Date(reservaApp.anyo,reservaApp.mes,reservaApp.dia,reservaApp.hora,reservaApp.minuto,0,0).getTime() / 60000;
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

    
    collection.insertOne(reservaBDDS,(err,result) =>{
        if(err){
            console.log("Error al insertar reserva");
            res.sendStatus(403);
        }else{
            console.log("Reserva insertada");
            res.sendStatus(200);
        }
        res.end();
    })
});

router.delete("/reserva/id/:id",async (req,res) =>{
    utils.deleteFromCollectionById("Reservas",parseInt(req.params.id),res,"Reserva eliminada","No hay ninguna reserva con ese id (Delete)")
});



//Aux 

module.exports = router;