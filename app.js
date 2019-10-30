//1.- Se inician con los Requires
//Para importar la libreria de express
//Recordar que es case sensitive 
var express = require('express');
//5.-Se cre la referencia a la libreria de mongoose
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


//2.-Voy a inicializar las variables 
var app = express();

//configuracion de body-parser. Middleware = Funciones que siempre se ejecutaran 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


//Importar rutas 
//no se coloca app.js porque se manejan objetos de javascript
var appRoutes = require('./routes/app');
//Para ocupar la ruta de usuarios
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


//6.- Para usar la libreria y conectarse a la BD
//despues de la Uri viene un callback que maneja 2 parametros. 1. El error y 2. El response
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) => {

    //Con throw err Javascript deja de ejecutar el siguiente codigo y se sale 
    if (error) throw error;

    console.log('Conexion a Base de datos lista ');
})

//La parte 4 se llevo al archivo app.js dentro de la carpeta routes
//Rutas
//Como se define appRoutes para que se pueda utilizar
//Se definira un middleware = Es algo que se ejecuta antes de que se resuelvan otras rutas
//Le dice que cualquier peticion que haga match con la pleca, utilizara appRoutes
//El de usuario debe ir arriba o siempre entrara por appRoutes
app.use('/usuario', usuarioRoutes)
app.use('/login', loginRoutes)
app.use('/', appRoutes);


//3.-Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en el puerto 3000 en linea');
});