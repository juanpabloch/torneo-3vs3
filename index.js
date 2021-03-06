const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);

const options={
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
};

const sessionStore = new MysqlStore(options);

app.use(express.static(`${__dirname}/public`));

app.use(express.urlencoded());
app.use(express.json());

app.use(session({
    key: 'coockie torneo',
    secret: 'session-3vs3-torneo',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 86400000,
        sameSite: true
    },
    store: sessionStore
}))

//rutas
const equipoRuta = require('./routes/rutaEquipoApi');
const jugadoresRuta = require('./routes/rutaJugadoresApi');
const webRutas = require('./routes/rutaWeb');

const validaciones = require('./validacion/validaciones');

app.use('/api/equipos', validaciones.validarUsuario, equipoRuta);
app.use('/api/jugadores', validaciones.validarUsuario, jugadoresRuta);
app.use('/', webRutas);



app.use((req, res, next)=>{
    const error = new Error('pagina no encontrada');
    error.status = 404;
    next(error)
})

app.use((err, req, res, next)=>{
    if(err.status === 404 || err.status === 413){
        res.json({
            error: err.message
        })
    }else{
        console.error(err)
        err.status = 500;
        res.json({
            error: 'error inesperado'
        })
    }
})

app.listen(port, ()=>{
    console.log(`server is listening on port: ${port}`);
});
