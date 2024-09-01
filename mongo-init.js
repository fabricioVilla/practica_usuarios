db = db.getSiblingDB('practicas');

// Crear colección e insertar documentos
db.usuarios.insertMany([
    {
        "nombre": "angelfabricio",
        "apellido_paterno": "perez",
        "apellido_materno": "villanueva",
        "correo": "afperez@gmail.com",
        "telefono": "1234567898",
        "contrasenia": "afpere@practicas",
        "usuario": "villanueva300"
      }
]);
// Crear índices
db.usuarios.createIndex({ usuario: 1 , telefono:1}, { unique: true });