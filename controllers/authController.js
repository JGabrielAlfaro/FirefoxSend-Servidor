
const Usuario = require('../models/modeloUsuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'.env'})
const {validationResult} = require('express-validator')

exports.autenticarUsuario = async(req,res,next) => {
    //Revisar si hay errores

    const errores = validationResult(req)
    if(!errores.isEmpty()){
      return res.status(400).json({errores: errores.array() });
    }

    //Buscar el usuario para ver si esta registrado
    const {email,password} = req.body
    const usuario = await Usuario.findOne({email})
    console.log(usuario)
    if (!usuario) {
        res.status(401).json({msg: "El usuario No Existe"});
        return next(); //No continua con el siguiente codigo en esta funcion.
        // next(); //Continua con el siguiente código de esta función.
    }

     //Verificar el password y atentificar el usuario.
    if (bcrypt.compareSync(password,usuario.password)){
        //Crear JWT.
       const token = jwt.sign({id:usuario._id, nombre: usuario.nombre,email:usuario.email },process.env.SECRETA,{expiresIn:'8h'})
    //    console.log(token)
    res.json({token})
    }else {
        res.status(401).json({msg: "El password es incorrecto"});
    }
   
}

    //Lo vamos hacer por middleware.
    exports.usuarioAutenticado = (req,res,next)=>{
    res.json({usuario: req.usuario})
    }
