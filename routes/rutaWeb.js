const express = require('express');
const router = express.Router();

const qy = require('../database/mysqlConnect');

const validacion = require('../validacion/validaciones')

router.get('/about', (req, res)=>{
    res.sendFile('about.html', {root: `${__dirname}/../public`});
});

router.get('/inscripcion', validacion.validarUsuario, (req, res)=>{
    res.sendFile('inscripcionForm.html', {root: `${__dirname}/../public`});
});

router.post('/inscripcion', async(req, res, next)=>{
    try {
        const data = req.body;
        
        // const nombreEquipo = {
        //     nombre_equipo: data.nombreEquipo
        // }

        let query = 'INSERT INTO basquet_equipo(nombre) VALUES ($1)'
        let respuesta = await qy(query, [data.nombreEquipo]);
        console.log(respuesta)
        const equipo_id = respuesta[0].id

        const addJugador = async(numero)=>{
            if(!data[`nombreJugador${numero}`]){
                return;
            };
            const jugador = {
                nombre: data[`nombreJugador${numero}`],
                email: data[`emailJugador${numero}`],
                equipo_id
            };
            
            query = 'INSERT INTO basquet_jugador(nombre, email, equipo_id) VALUES($1, $2, $3)'
            respuesta = await qy(query, [jugador]);

        };

        for (let i = 0; i < 6; i++) {
            addJugador(i);
        };

        res.redirect('/equipos');
    } catch (err) {
        if(err.code === 'ER_DUP_ENTRY'){
            const error = err;
            error.message = 'Error datos duplicados';
            error.status = 413;
        }
        next(err);
    }
})

router.get('/equipos', (req, res)=>{
    res.sendFile('listaEquipos.html', {root: `${__dirname}/../public`});
});

router.get('/jugadores', validacion.validarUsuario, (req, res)=>{
    res.sendFile('listaJugadores.html', {root: `${__dirname}/../public`});
});

router.get('/login', (req, res)=>{
    res.sendFile('login.html', {root: `${__dirname}/../public`});
});

router.post('/login', validacion.validarLogin, (req, res)=>{
    res.cookie('userName', req.session.user, {
        maxAge: 86400000,
        sameSite: true,
    });

    res.redirect('/');
});

router.get('/registrate', validacion.validarUsuarioRegistro,(req, res)=>{
    res.sendFile('registro.html', {root: `${__dirname}/../public`});
});


router.post('/registrate', validacion.validarRegistro,async(req, res, next)=>{
    try {
        const { userName, password, password2 } = req.body;
        let query = 'SELECT nombre FROM usuarios WHERE nombre = $1';
        let respuesta = await qy(query, [userName]);
        if(respuesta.length)throw new Error('usuario ya existe');

        query = 'INSERT INTO usuarios (nombre, password) VALUES ($1, $2)'
        respuesta = await qy(query, [userName, password]);

        res.redirect('/login');

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            error.status = 413;
        }
        next(err);
    }
});

router.get('/logout', (req, res, next)=>{
    // res.clearCookie('userName');
    // req.session.destroy((err)=>{
    //     if(err){
    //         next(err);
    //     }
    res.redirect('/');
});

module.exports = router;
