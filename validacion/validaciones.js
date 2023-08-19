const qy = require('../database/mysqlConnect');
const jwt = require('jsonwebtoken');

const validarRegistro = (req, res, next)=>{

    const { userName, password, password2 } = req.body;

    try {
        if(userName.length < 3)throw new Error('nombre debe ser mayor a 3 caracteres');
        if(password.length < 5)throw new Error('el password debe tener mas de 5 caracteres');
        if(password !== password2)throw new Error('error confirmacion password');
        next()
    } catch (err) {
        if(err){
            const error = err;
            error.status = 413;
            next(error);
        }
    }

}

const validarLogin = async(req, res, next)=>{
    const { userName, password} = req.body;
    try {
        if (/\W/.test(userName) || userName.length == 0){
            throw new Error('Nombre de usuario o contraseña invalidos');
        }
        next()
    } catch (err) {
        if(err.code === undefined){
            const error = err
            error.status = 413;
        }
        next(err)
    }
}


const validarUsuario = (req, res, next)=>{
    const token = req.cookies == undefined ? undefined : req.cookies.token
    if (!token) {
        return res.redirect('/login')
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        console.log(decoded)
        req.userId = decoded.userId;
      } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

    next()
}

const validarUsuarioRegistro = (req, res, next)=>{
    // if(req.session.auth)
    // return res.redirect('/')
    next()
}

module.exports = {
    validarRegistro,
    validarLogin,
    validarUsuario,
    validarUsuarioRegistro
}


/* 

*/