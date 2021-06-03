const mysql = require('mysql');
const util = require('util');

const connection = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
})

// connection.connect((error)=>{
//     if(error)throw new Error('No se pudo conectar con la base de datos');
//     console.log('conexion con la base de datos mysql establecida correctamente');
// })

const qy = util.promisify(connection.query).bind(connection);

module.exports = qy;

//mysql://b1a7938b561099:6d357f5a@us-cdbr-east-03.cleardb.com/heroku_e08c6defbbb5ac1?reconnect=true
