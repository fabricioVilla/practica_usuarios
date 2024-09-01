

import {MongoClient} from 'mongodb'
const url = process.env.URLDECONECCION;
const dbName = process.env.NOMBREDELABASE;
const collectionName= process.env.COLECCION;

const conecta = async()=>{
try {

    console.log("url: ", url);
    let client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
    // the following code examples can be pasted here...
} catch (error) {
     throw new Error("Error al conectar a mongo: "+error);
}

}


export const recupera_usuarios= async ()=>{

    try {
        let collection = await conecta();
        const findResult = await collection.find({}).toArray();
        console.log('consulta exitoza, cantidad de usurios: ',findResult.length);
        return findResult;
    } catch (error) {
        throw new Error("Error al consultar usuario "+error);
    }

}


export const recupera_usuario= async (usuario_o_telefono, contrasenia)=>{
    console.log("contrasenia: ", contrasenia);
    console.log("usuario_o_telefono: ", usuario_o_telefono);

    try {
        let collection = await conecta();
        let query={$and:[{"contrasenia":contrasenia},{$or:[{"usuario":usuario_o_telefono},{"telefono":usuario_o_telefono}]}]}
        const findResult = await collection.find(query).toArray();
        console.log('consulta exitoza, cantidad de usurios: ',findResult.length);
        return findResult;
    } catch (error) {
        throw new Error("Error al consultar usuario "+error);
    }

}

export const crea_usuario= async (usuario)=>{

    try {
        let collection = await conecta();
        await collection.insertOne(usuario);
       console.log("se resguarda el usuario exitozamente")
    } catch (error) {
        throw new Error("Error al insertar usuario "+error);
    }


}