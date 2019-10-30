var express = require('express');

var app = express();

//Esto es para obtener los datos desde mongodb
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');

//importo el middleware
var mdAutentificacion = require('../middlewares/autentificacion');


//*******************************
//Para obtener todos los usuarios
//*******************************
app.get('/', (req, res, next) => {
    //voy a consultar la BD
    //Si en el find los corchetes estan vacios querra decir que obtenga todo
    //en el callback recibe 2 parametros. 1 el error y 2. la respuesta
    //para el find se puede enviar un segundo parametro para obtener solo los campos que me interesan
    //y ahora se utiliza el exec y dentro de el se maneja el callback
    Usuario.find({}, 'nombre email role img ')
        .exec(
            (err, usuarios) => {

                //Si hay algun error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Problema de base de datos',
                        errores: err
                    })
                }

                //Si no sucede ningun error
                res.status(200).json({
                    ok: true,
                    //Con los estandares del Ecmascript6 la sentencia puede quedar solo como usuarios
                    usuarios: usuarios
                })
            }
        );

});





//***************************
//Para actualizar usuario
//***************************
//puede recibir request, response y next. En esta ocasion no se usa el next
//Con el :id es un recurso obligatorio que debera proporcionar el usuario
//Si queremos aplicar un middleware en un metodo se debe enviar como segundo parametro
app.put('/:id', mdAutentificacion.verificatoken, (req, res) => {

    var id = req.params.id;

    //La funcion findById regresara un callback con un error o un response 
    Usuario.findById(id, (err, usuarioencontrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errores: err
            })
        }

        if (!usuarioencontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro el usuario con el id: ' + id,
                errores: { mensaje: 'No se encontro el usuario' }
            })
        }

        var body = req.body;

        usuarioencontrado.nombre = body.nombre;
        usuarioencontrado.email = body.email;
        usuarioencontrado.role = body.role;

        usuarioencontrado.save((err, usuarioModificado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errores: err
                });
            }

            //Una vez que se actualizo el usuario y NO se quiere que se refleje  el password 
            //se puede actualizar el campo
            usuarioencontrado.password = ':O';

            res.status(200).json({
                ok: true,
                usuario: usuarioModificado
            });

        });

    });



})



//***************************
//Para ingresar usuarios
//***************************
//En estos metodos siempre se recibira request, response y next. Este ultimo se puede omitir
//El request se recibira en un formato x-www-form-urlencoded
//para convertirlo en un objeto de javascript se utilizara el middleware body-parser
app.post('/', mdAutentificacion.verificatoken, (req, res) => {

    var body = req.body; //Esto solo funcionara si se instalo y configuro el body-parser

    //Usuario es el modelo de datos que se creo y se definio
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    //Para guardarlo en mongodb
    //se recibe un callback cuando se graba el usuario
    //puede que reciba un error por si faltan datos 
    usuario.save((err, usuarioguardado) => {

        //Si hay algun error
        if (err) {
            //se retorna un codigo 400 por que es un bad request
            return res.status(400).json({
                ok: false,
                mensaje: 'Problema al guardar el usuario',
                errores: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioguardado,
            usuariotoken: req.usuario

        })
    });

});


//***************************
//Para borrar un usuario por id
//***************************

app.delete('/:id', mdAutentificacion.verificatoken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Problema al borrar el usuario',
                errores: err
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})


//Para utilizarlo fuera de este archivo 
module.exports = app;