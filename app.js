//1.- Se inician con los Requires
//Para importar la libreria de express
//Recordar que es case sensitive 
var express = require('express');
//5.-Se cre la referencia a la libreria de mongoose
var mongoose = require('mongoose');


//2.-Voy a inicializar las variables 
var app = express();

//6.- Para usar la libreria y conectarse a la BD
//despues de la Uri viene un callback que maneja 2 parametros. 1. El error y 2. El response
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) => {

    //Con throw err Javascript deja de ejecutar el siguiente codigo y se sale 
    if (error) throw error;

    console.log('Conexion a Base de datos lista ');

})

//4.-Aqui se crea la primer ruta
//En el get el 1er parametro se configura la ruta y en el segundo un callback
//El callback recibe 3 parametros  1.el request, 2.response y 3.el next
//El next ya casi no se utiliza con los comandos get,post,put y  delete. Se utilizan mas en los middleware 
app.get('/', (req, res, next) => {
    //con el status se envia una respuesta
    //en el json se envia un objeto de javascript
    //Es importante manejar un estandar para nuestros objetos que se regresan
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion satisfactoria'
    })
})

//3.-Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en el puerto 3000 en linea');
});