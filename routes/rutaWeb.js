const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const qy = require('../database/mysqlConnect');

const validacion = require('../validacion/validaciones')

router.get('/about', (req, res)=>{
    res.sendFile('about.html', {root: `${__dirname}/../public`});
});

router.get('/inscripcion', validacion.validarUsuario, (req, res)=>{
    res.sendFile('inscripcionForm.html', {root: `${__dirname}/../public`});
});

router.get('/equipos', validacion.validarUsuario, (req, res)=>{
    res.sendFile('listaEquipos.html', {root: `${__dirname}/../public`});
});

router.get('/jugadores', validacion.validarUsuario, (req, res)=>{
    res.sendFile('listaJugadores.html', {root: `${__dirname}/../public`});
});

router.get('/login', (req, res)=>{
    res.sendFile('login.html', {root: `${__dirname}/../public`});
});

router.post('/login', validacion.validarLogin, async (req, res)=>{
    const { userName, password} = req.body;
    try {
        let query = 'SELECT * FROM usuarios WHERE nombre = $1';
        let respuesta = await qy(query, [userName])

        if(respuesta.rows.length === 0)throw new Error('Nombre de usuario o contraseña invalidos');

        const user = respuesta.rows[0]
        const validPassword = await bcrypt.compare(password, user.password)
        
        if (!validPassword)throw new Error('Nombre de usuario o contraseña invalidos');
        
        // jwt
        const token = jwt.sign({userId: user.user_id}, 'secret')
        res.cookie('token', token, { httpOnly: true });
        res.cookie('login', true);
        res.redirect('/');
    } catch (err) {
        if(err.code === undefined){
            const error = err
            error.status = 413;
            console.log(error)
            next(error)
        }
        next(err)
    }
});

router.get('/registrate', validacion.validarUsuarioRegistro,(req, res)=>{
    res.sendFile('registro.html', {root: `${__dirname}/../public`});
});


router.post('/registrate', validacion.validarRegistro,async(req, res, next)=>{
    try {
        const { userName, password } = req.body;
        let query = 'SELECT nombre FROM usuarios WHERE nombre = $1';
        let respuesta = await qy(query, [userName]);
        if(respuesta.length)throw new Error('usuario ya existe');

        const hashedPassword = await bcrypt.hash(password, 10)

        query = 'INSERT INTO usuarios (nombre, password) VALUES ($1, $2)'
        respuesta = await qy(query, [userName, hashedPassword]);

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
    res.cookie('token', '');
    res.cookie('login', false);
    res.redirect('/');
});

module.exports = router;
