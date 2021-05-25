const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: 'freedb.tech',
    user: 'freedbtech_juanpabloch',
    password: '32620420jpc',
    port: 3306,
    database: 'freedbtech_utnTpExpress'
})

connection.connect((error)=>{
    if(error)return next(error);
    console.log('conexion con la base de datos mysql establecida correctamente');
})

const qy = util.promisify(connection.query).bind(connection);

module.exports = qy;