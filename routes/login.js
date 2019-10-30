var express = require('express');
var app = express();

//Para obtener la firma del token
var SEED = require('../config/config').SEED;

//Esto es para obtener los datos desde mongodb
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

app.post('/', (req, res) => {

    var body = req.body; //Esto solo funcionara si se instalo y configuro el body-parser

    //Se recibe un callback que puede regresar 
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {
            //se retorna un codigo 400 por que es un bad request
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errores: err
            })
        }

        if (!usuarioBD) {
            //se retorna un codigo 400 por que es un bad request
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado',
                errores: err
            })
        }

        //Para comparar la contraseña encriptada con otra cadena
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errores: err
            })
        }

        //Se cambiara en el usuarioBD el password para que no se incluya en el token
        usuarioBD.password = '=D';

        //Aqui se creara el JWT
        //jwt.sign recibe como primer parametro el payload que es la data del usuario
        //En segundo lugar el SEED o semilla
        //Finalmente se coloca la vigencia . 14400=4 horas
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 })


        res.status(200).json({
            ok: true,
            mensaje: 'login correcto',
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        })


    })

});





//Para exportar este archivo y utilizarlo en otro lado
module.exports = app;