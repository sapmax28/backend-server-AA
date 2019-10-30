//1. Se importa mongoose
var mongoose = require('mongoose');
//aqui se utilizara el plugin unique validator
var uniqueValidator = require('mongoose-unique-validator');

//La funcion Schema de mongoose nos ayuda a definir esquemas 
var Esquema = mongoose.Schema;

//Esta parte es para delimitar los roles validos y de otra forma 
//enviara un mensaje de error.
//estos roles se pasaran en el campo a traves de un enum
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}, no es un rol permitido'
}


//Esquema recibira un objeto de javascript y se definiran los campos que se establecieron en la BD
// asi como el tipo de dato, si es requerido y el mensaje que saldra en la validación
var usuarioSchema = new Esquema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'El password es requerido'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
});

//Para aplicar el plugin
//se coloca PATH por si se tienen varios campos que deben ser unicos. Y en este caso enviara el nombre del campo
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

//Este archivo debe ocuparse afuera y por ello se hace el export
//El nombre 'Usuario' es como se identificara el modelo fuera de este archivo
module.exports = mongoose.model('Usuario', usuarioSchema);