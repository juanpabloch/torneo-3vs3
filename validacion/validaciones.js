const qy = require('../database/mysqlConnect');

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
        
        let query = 'SELECT nombre FROM usuarios WHERE nombre = $1 AND password = $2';
        let respuesta = await qy(query, [userName, password])
        if(respuesta.length === 0)throw new Error('usuario/contraseña incorrecto');

        req.session.user = userName;
        req.session.auth = true;

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
    // if(!req.session.auth)return res.redirect('/login')
    next()
}

const validarUsuarioRegistro = (req, res, next)=>{
    // if(req.session.auth)
    return res.redirect('/')
    next()
}

module.exports = {
    validarRegistro,
    validarLogin,
    validarUsuario,
    validarUsuarioRegistro
}