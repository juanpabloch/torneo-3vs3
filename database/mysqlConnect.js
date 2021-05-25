const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b1a7938b561099',
    password: '6d357f5a',
    port: process.env.PORT || 3306,
    database: 'heroku_e08c6defbbb5ac1'
})

connection.connect((error)=>{
    if(error)return next(error);
    console.log('conexion con la base de datos mysql establecida correctamente');
})

const qy = util.promisify(connection.query).bind(connection);

module.exports = qy;

//mysql://b1a7938b561099:6d357f5a@us-cdbr-east-03.cleardb.com/heroku_e08c6defbbb5ac1?reconnect=true