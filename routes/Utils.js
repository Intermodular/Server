const app = require("../app");


//Funciones auxiliares: Gets
async function getListFromCollection(collectionName){
    
    let collection = app.getDatabase().collection(collectionName);
    let cursor = await collection.find({})
    let list = await cursor.toArray();

    return list; 
}

async function getDocumentFromCollectionById(collectionName,id){
    let database = app.getDatabase();
    let collection = database.collection(collectionName);
    let empleado = await collection.findOne({"_id":id});
    return empleado;
}



//Funciones auxiliares: Posts

async function saveDocument(collectionName,newDocument,autoIncrementId,response,succesMessage,errorMessage){
    let database = app.getDatabase();
    let collection = database.collection(collectionName);

    if(autoIncrementId){
        let listWithMaxId = await collection.find({}).sort({_id:-1}).limit(1).toArray();
        let id = listWithMaxId[0]._id + 1;
        newDocument._id = id;
    }

    collection.insertOne(newDocument, (err,result) => {
        if(err){
            console.log(errorMessage);
            response.sendStatus(403);
        }else{
            console.log(succesMessage);
            response.sendStatus(200);
        }
        
        response.end();
    });
}

async function checkUserNameFromEmployeeExists(employee){
    let database = app.getDatabase();
    let collection = database.collection("Empleados");
    const empleado = await collection.findOne({_id:{$ne:employee._id},usuario:employee.usuario}); //Para que funcione en el replace tmb hay que comprobar que la coincidencia sea con el usuario de otro empleado
    return empleado != null;
}

//Funciones auxiliares: Puts
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

//Funciones Deletes
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

exports.getListFromCollection = getListFromCollection;
exports.getDocumentFromCollectionById = getDocumentFromCollectionById;
exports.saveDocument = saveDocument;
exports.checkUserNameFromEmployeeExists = checkUserNameFromEmployeeExists;
exports.replaceInCollectionById = replaceInCollectionById;
exports.deleteFromCollectionById = deleteFromCollectionById;