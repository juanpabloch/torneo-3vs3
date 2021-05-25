const express = require('express');
const router = express.Router();

const qy = require('../database/mysqlConnect');


router.get('/inscripcion', (req, res)=>{
    res.sendFile('inscripcionForm.html', {root: `${__dirname}/../public`});
})

router.post('/inscripcion', async(req, res, next)=>{
    try {
        const data = req.body;
        
        const nombreEquipo = {
            nombre_equipo: data.nombreEquipo
        }

        let query = 'INSERT INTO basquet_equipo SET ?'
        let respuesta = await qy(query, [nombreEquipo]);
        const equipo_id = respuesta.insertId

        const addJugador = async(numero)=>{
            if(!data[`nombreJugador${numero}`]){
                return
            }
            const jugador = {
                nombre: data[`nombreJugador${numero}`],
                email: data[`emailJugador${numero}`],
                equipo_id
            }
            
            query = 'INSERT INTO basquet_jugador SET ?'
            respuesta = await qy(query, [jugador]);

        }

        for (let i = 0; i < 6; i++) {
            addJugador(i);
        }

        res.redirect('/equipos')
    } catch (err) {
        if(err.code === 'ER_DUP_ENTRY'){
            const error = err
            error.message = 'Error datos duplicados'
            error.status = 413;
        }
        next(err)
    }
})

router.get('/equipos', (req, res)=>{
    res.sendFile('listaEquipos.html', {root: `${__dirname}/../public`});
})

router.get('/jugadores', (req, res)=>{
    res.sendFile('listaJugadores.html', {root: `${__dirname}/../public`});
})

router.get('lista')

module.exports = router;
