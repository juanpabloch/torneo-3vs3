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
        res.status(200).json(respuesta)
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

        const query = 'SELECT  basquet_jugador.nombre, basquet_jugador.email, basquet_equipo.nombre_equipo  FROM basquet_jugador INNER JOIN basquet_equipo ON basquet_jugador.equipo_id = basquet_equipo.id'
        const respuesta = await qy(query);
        res.json(respuesta);

    } catch (err) {
        console.log(err)
    }
})


router.get('/:id', async(req, res, next)=>{
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM basquet_jugador WHERE id = ?';
        const respuesta = await qy(query, [id]);
        if(respuesta.length === 0)throw new Error('jugador no encontrado');

        res.status(200).json(respuesta)
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
        const jugador = req.body;
        let query = 'INSERT INTO basquet_jugador SET ?'
        let respuesta = await qy(query, [jugador]);
        const id = respuesta.insertId;

        query = 'SELECT * FROM basquet_jugador WHERE id = ?'
        respuesta = await qy(query, [id]);

        res.status(200).json(respuesta);

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
        const jugador = req.body;

        let query = 'UPDATE basquet_jugador SET ? WHERE id = ?'
        let respuesta = await qy(query, [jugador, id]);

        if(!respuesta.affectedRows)throw new Error('no existe ese jugador')

        query = 'SELECT * FROM basquet_jugador WHERE id = ?'
        respuesta = await qy(query, [id]);

        res.status(200).json(respuesta); 

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

        const query = 'DELETE FROM basquet_jugador WHERE id = ?'
        const respuesta = await qy(query, [id]);
        if(!respuesta.affectedRows)throw new Error('jugador no encontrado');

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
    const query = 'SELECT * FROM basquet_jugador WHERE equipo_id = ?'
    const jugadores = await qy(query, [equipo_id]);
    res.json(jugadores);
})



module.exports = router