const mongoose =  require('mongoose');

//Indicamos donde esta las variables del entorno para dotenv.
require('dotenv').config({
    path: 'variables.env'
})

//Funcion para conectar a la base de datos.
require('dotenv').config()
const conectarDB = async () => {
    try {
        const conn = await mongoose.createConnection(process.env.DB_URL).asPromise();
        console.log("DB conectada ok",conn.readyState );
    } catch (error) {
        console.log("Se presento un error");
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectarDB;