const express = require('express');
const router = express.Router();

const qy = require('../database/mysqlConnect')

//  *  GET /api/jugadores -> listado de todos los artistas
//  *  GET /api/jugadores/:id -> Obtener el artista cuyo ID es pasado como parametro
//  *  POST /api/jugadores -> Agregar un artista
//  *  PUT /api/jugadores/:id -> Actualizar los datos del artista cuyo ID es pasado como parametro
//  *  DELETE /api/jugadores/:id -> Borrar el artista cuyo ID es pasado como parametros

router.get('/', async(req, res, next)=>{
    try {
        const query = 'SELECT * FROM basquet_jugador';
        const respuesta = await qy(query);
        res.status(200).json(respuesta.rows)
    } catch (err) {
        if(err.code === undefined){
            const error = err;
            error.status = 413;
            next(error);
        }
        next(err)
    }
})

router.get('/jugadorEquipo', async(req, res, next)=>{
    try {
        const query = 'SELECT basquet_jugador.nombre, basquet_jugador.email, basquet_equipo.nombre AS team FROM basquet_jugador INNER JOIN basquet_equipo ON basquet_equipo.id = basquet_jugador.equipo_id'
        const respuesta = await qy(query);
        res.json(respuesta.rows);

    } catch (err) {
        console.log(err)
    }
})


router.get('/:id', async(req, res, next)=>{
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM basquet_jugador WHERE id = $1';
        const respuesta = await qy(query, [id]);
        if(respuesta.rows.length === 0)throw new Error('jugador no encontrado');

        res.status(200).json(respuesta.rows[0])
    } catch (err) {
        if(err.code === undefined){
            const error = err;
            error.status = 413;
            next(error);
        }
        next(err)
    }
})

router.post('/', async(req, res, next)=>{
    try {
        const {nombre, email, equipo_id}= req.body;
        let query = 'INSERT INTO basquet_jugador(nombre, email, equipo_id) VALUES($1, $2, $3) RETURNING id'
        let respuesta = await qy(query, [nombre, email, equipo_id]);
        const id = respuesta.rows[0].id;

        query = 'SELECT * FROM basquet_jugador WHERE id = $1'
        respuesta = await qy(query, [id]);

        res.status(200).json(respuesta.rows[0]);

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            error.status = 413;
            next(error);
        }
        if(err.code === 'ER_DUP_ENTRY'){
            const error = new Error('el email ya existe');
            error.status = 413;
            next(error);
        }
        next(err)
    }
})

router.put('/:id', async(req, res, next)=>{
    try {
        const {id} = req.params;
        const {nombre} = req.body;

        let query = 'SELECT * FROM basquet_jugador WHERE id = $1';
        let respuesta = await qy(query, [id]);
        if(respuesta.rows.length === 0)throw new Error('jugador no encontrado');

        query = 'UPDATE basquet_jugador SET nombre=$1 WHERE id=$2'
        respuesta = await qy(query, [nombre, id]);

        query = 'SELECT * FROM basquet_jugador WHERE id = $1'
        respuesta = await qy(query, [id]);

        res.status(200).json(respuesta.rows[0]); 

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            error.status = 413;
            next(error);
        }
        if(err.code === 'ER_DUP_ENTRY'){
            const error = new Error('el email ya existe');
            error.status = 413;
            next(error);
        }
        next(err)
    }
})


router.delete('/:id', async(req, res, next)=>{
    try {
        const {id} = req.params;
        let query = 'SELECT * FROM basquet_jugador WHERE id = $1';
        let respuesta = await qy(query, [id]);
        if(respuesta.rows.length === 0)throw new Error('jugador no encontrado');

        query = 'DELETE FROM basquet_jugador WHERE id = $1'
        respuesta = await qy(query, [id]);

        res.status(200).json({
            mensaje: 'jugador borrado correctamente'
        })

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            error.status = 413;
            next(error);
        }
        
        next(err)
    }
})

router.get('/:equipo_id/jugadores', async(req, res)=>{
    const {equipo_id} = req.params;

    let query = 'SELECT * FROM basquet_equipo WHERE id = $1';
    let respuesta = await qy(query, [equipo_id]);
    if(respuesta.rows.length === 0)throw new Error('Equipo no encontrado');

    query = 'SELECT * FROM basquet_jugador WHERE equipo_id = $1'
    respuesta = await qy(query, [equipo_id]);
    res.json(respuesta.rows);
})



module.exports = router