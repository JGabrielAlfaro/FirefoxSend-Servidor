const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const usuarioSchema = new Schema({
    email: {
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        trim:true
    },
    nombre: {
        type:String,
        required:true,
        trim:true
    },
    password: {
        type:String,
        required:true,
        trim:true
    }
})

//nombre model: Usuarios, y le pasamos el shema: usuarioSchema
module.exports = mongoose.model('Usuarios',usuarioSchema)