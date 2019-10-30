var express = require('express');


var app = express();

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


//Para utilizarlo fuera de este archivo 
module.exports = app;