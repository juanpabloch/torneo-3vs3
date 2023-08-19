const mysql = require('mysql');
const util = require('util');
const {Pool} = require('pg')
require('dotenv').config()

// const connection = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// })

// connection.connect((error)=>{
//     if(error)throw new Error('No se pudo conectar con la base de datos');
//     console.log('conexion con la base de datos mysql establecida correctamente');
// })

// const qy = util.promisify(connection.query).bind(connection);

// module.exports = qy;

//mysql://b1a7938b561099:6d357f5a@us-cdbr-east-03.cleardb.com/heroku_e08c6defbbb5ac1?reconnect=true


const connection = new Pool({
    // connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABSE
})


connection.connect((err)=>{
    if(err)throw new Error('Error al conectar a la base de datos');
    console.log('base de datos conectada')
})

const qy = util.promisify(connection.query).bind(connection)

// module.exports = connection.query;
module.exports = qy;