import jwt from 'jsonwebtoken';
import fs from 'fs';
const privateKey = fs.readFileSync('./config/privatekey.pem');
let tokens_revocados=[];
let tarea_eliminar_tokens=false; 
let intervalId;

export const generar_token=(usuario)=>{

    return jwt.sign(usuario, privateKey, { expiresIn: '5m' },{ algorithm: 'RS256' }, function(err, token) {
        console.log(token);
    });

};

export const valida_token=(req, res, next)=>{
    const accesstoken = req.headers['x-token'];
    if (!accesstoken){
        return res.status(400).json({status: 400, message: "acceso denegado, x-token es requerido en los headers"}); 
    }
    jwt.verify(accesstoken, privateKey, (err,data)=>{
        if(err ){
            res.status(400).json({status: 400, message: "x-token incorrecto o expirado"}); 
        }else if (tokens_revocados.find(element => element.token == accesstoken)){
            res.status(400).json({status: 400, message: "token revocado"}); 
        }else{
            next();
        }
    })
};


export const remover_token=(req, res, next)=>{
    const accesstoken = req.headers['x-token'];
    console.log("_______accesstoken: ", accesstoken);

    
    if (!accesstoken){
        return res.status(400).json({status: 400, message: "acceso denegado, x-token es requerido en los headers"}); 
    }
    jwt.verify(accesstoken, privateKey, (err,data)=>{
        if(err){
            res.status(400).json({status: 400, message: "x-token incorrecto o expirado"});
        }else{
            
            //evita tokens repetidos
            if(tokens_revocados.find(element => element.token == accesstoken)==undefined)
                tokens_revocados.push({"token":accesstoken,"fecha_expiracion":fecha_expiracion()}); 
            if(!tarea_eliminar_tokens){
                detona_jod();
                tarea_eliminar_tokens=true;
            }
            next();
        }
    })
   
};

function fecha_expiracion(){
    const newDate = new Date();
    // Agregar minutos
    newDate.setMinutes(newDate.getMinutes() + 5);
    console.log("token se eliminara en: ", newDate);
    return newDate;
}

function eliminar_tokens_revocados() {
    
    const fechaHoraActual = new Date();
    fechaHoraActual.setMinutes(fechaHoraActual.getMinutes());
    console.log("La función se ejecuta cada 5m para limpiar la lista de tokens revocados ",fechaHoraActual);
   
    let tokens_revocados_index=-1
    do {
        let tokens_revocados_index = tokens_revocados.findIndex(item => item.fecha_expiracion <= fechaHoraActual);
        // console.log("tokens_revocados_index: ", tokens_revocados_index);
        if(tokens_revocados_index>=0){
            console.log("se lemina token con la fecha de expiracion ",tokens_revocados[tokens_revocados_index].fecha_expiracion);
            tokens_revocados.splice(tokens_revocados_index, 1);
        }
    } while (tokens_revocados_index!=-1);
    
    if(tokens_revocados.length==0){
        console.log("tokens_revocados estan vasio");
        tarea_eliminar_tokens=false;
        clearInterval(intervalId);
    }
    console.log("tokens_revocados ", tokens_revocados.length);
}


function detona_jod(){
    // Configura el intervalo para ejecutar la función cada 300000 ms (5 minutos)
    intervalId = setInterval(eliminar_tokens_revocados, 300000);
}

