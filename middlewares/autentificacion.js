//Para obtener la firma del token
var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');


//***************************
// Aqui se creará el Middleware
// Verificará el token que se reciba 
// Se coloca en este punto la validacion ya que hacia abajo estan las demas peticiones 
// que requieren autentificación.
// Cualquier solicitud que se haga pasara primero por este punto
// Aqui se utilizara el request, response y next
//Se debe hacer dinamico ya que la verificacion de token se hara en usuarios, hospitales y doctores
//***************************


//Para utilizar esta funcion en otros archivos 

exports.verificatoken = function(req, res, next) {
    //Obtengo el token que el cliente debera enviar
    var token = req.query.token;

    //Para verificar el token recibido , se coloca el SEED y regresa un callback
    //En el decoded se tiene la informacion del usuario logeado
    jwt.verify(token, SEED, (err, decoded) => {
        //Si hay un error se envia este mensaje y ya ningun metodo funcionara hasta que se le envie un token valido
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errores: err
            })
        }

        //El siguiente codigo es para poner disponible la informacion del usuario loqueado
        //en cualquier peticion
        req.usuario = decoded.usuario;

        //Es necesario colocar la sentencia next para que continue 
        //con la aplicacion
        next();

        //Esto solo fue para ver que tenia el decoded
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // })

    })

}