import schema from '../config/schema.json' assert { type: 'json' };
import Ajv from 'ajv';
import addErrors from'ajv-errors';
import {crea_usuario,recupera_usuarios,recupera_usuario} from '../dao/conexionMongo.js'
import { generar_token } from '../funciones/token.js';

const ajv = new Ajv({ allErrors: true });
addErrors(ajv);



export const insertaUsuario=async(data, res)=>{
    console.log("data: ", data.body);
   
   try {
   
        const validate = ajv.compile(schema.schemas_usuario);

        const valid = validate(data.body);
    
        if (!valid){
           console.log(validate.errors);
           let errores=[]
           validate.errors.forEach(element => {
            errores.push(element.message)
           });
           return res.status(400).json({status: 400, message: errores}) 
        } 
        await crea_usuario(data.body)
   } catch (error) {
        console.log(":::::::error insertaUsuario ", error);
        return res.status(500).json({status: 500, message: error.message}) 
   }
    
   return res.json({
        mensaje: 'exitos post',
        status: 'funcionando',
        fecha: new Date()
    });


}


export const recuperarUsuarios=async(data,res)=>{
    let resultado;
    try {
   
        resultado = await recupera_usuarios();
        
   } catch (error) {
        console.log(":::::::error recuperarUsuarios ", error);
        return res.status(500).json({status: 500, message: error.message}) 
   }
    
   return res.json({
        mensaje: 'exitos get',
        status: 'funcionando',
        fecha: new Date(),
        resultado:resultado
    });

}



export const login=async(data,res)=>{
     let resultado;
     let token;
     let mensaje="login exitoso, token expira en 5 minutos"
     try {
          const validate = ajv.compile(schema.schema_login);

          const valid = validate(data.body);
     
          if (!valid){
               console.log(validate.errors);
               let errores=[]
               validate.errors.forEach(element => {
               errores.push(element.message)
               });
               return res.status(400).json({status: 400, message: errores}) 
          } 
    
         resultado = await recupera_usuario(data.body.usuario_o_telefono, data.body.contrasenia);

         if(resultado?.length>0){
               token = generar_token(data.body);
         }else{
               return res.status(404).json({status: 404, message: "usuario_o_telefono o contrasenia incorrectos, no se encontraron resultados"}) 
         }
         console.log("login exitoso");
    } catch (error) {
         console.log(":::::::error login  ", error);
         return res.status(500).json({status: 500, message: error.message}) 
    }
     
    return res.json({
         mensaje: mensaje,
         status: 'funcionando',
         fecha: new Date(),
         resultado: resultado,
         token: token? token: ""
     });
 
 }


 export const logout=async(data,res)=>{
    return res.json({
         mensaje: "token rebocado",
         status: 'funcionando',
         fecha: new Date()
     });
 
 }