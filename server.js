const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/public`));

app.use(express.urlencoded());
app.use(express.json());

//rutas
const equipoRuta = require('./routes/rutaEquipoApi');
const jugadoresRuta = require('./routes/rutaJugadoresApi');
const webRutas = require('./routes/rutaWeb');

app.use('/api/equipos', equipoRuta);
app.use('/api/jugadores', jugadoresRuta);
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