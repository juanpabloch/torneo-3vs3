const express = require('express');
const router = express.Router();

const qy = require('../database/mysqlConnect')


router.get('/', async(req, res, next)=>{
    try {
        const query = 'SELECT * FROM basquet_equipo';
        const respuesta = await qy(query);
        res.json(respuesta);

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            err.status = 413;
            next(error);
        }
        next(err)
    }
})

router.get('/:id', async(req, res, next)=>{
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM basquet_equipo WHERE id = ?';
        const respuesta = await qy(query, [id]);
        if(respuesta.length === 0)throw new Error('Equipo no encontrado');
        res.status(200).json(respuesta);

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            err.status = 413;
            next(error);
        }
        next(err)
    }
})


router.post('/', async(req, res, next)=>{
    try {
        const nombre = req.body;
        if(!nombre)throw new Error('nombre de equipo no debe quedar vacio')

        let query = 'INSERT INTO basquet_equipo SET ?'
        let respuesta = await qy(query, [nombre]);

        const id = respuesta.insertId;

        query = 'SELECT * FROM basquet_equipo WHERE id = ?';
        respuesta = await qy(query, [id]);

        res.status(200).json(respuesta);

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            err.status = 413;
            next(error);
        }
        if(err.code === 'ER_DUP_ENTRY'){
            const error = new Error('el nombre del equipo ya existe');
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
        if(!nombre)throw new Error('no ingresaste ningun nombre');

        let query = 'UPDATE basquet_equipo SET nombre = ? WHERE id = ?';
        let respuesta = await qy(query, [nombre, id]);

        query = 'SELECT * FROM basquet_equipo WHERE id = ?'
        respuesta = await qy(query, [id]);
        
        res.status(200).json(respuesta);


    } catch (err) {
        if(err.code === undefined){
            const error = err;
            err.status = 413;
            next(error);
        }
        if(err.code === 'ER_DUP_ENTRY'){
            const error = new Error('ese nombre ya existe');
            error.status = 413;
            next(error);
        }
        next(err)
    }
})


router.delete('/:id', async(req, res, next)=>{
    try {
        const { id } = req.params;
        const query = 'DELETE FROM basquet_equipo WHERE id = ?';
        const respuesta = await qy(query, [id]);
        if(!respuesta.affectedRows)throw new Error('Equipo no encontrado');

        res.status(200).json({
            mensaje: "equipo borrado correctamente"
        })

    } catch (err) {
        if(err.code === undefined){
            const error = err;
            err.status = 413;
            next(error);
        }
        next(err)
    }
})

module.exports = router