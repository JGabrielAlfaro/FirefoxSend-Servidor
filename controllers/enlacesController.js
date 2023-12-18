const shortid = require ('shortid')
const Enlaces = require('../models/modeloEnlace')
const bcrypt = require ('bcrypt')
const {validationResult} = require('express-validator')


exports.nuevoEnlace = async (req,res,next) =>{
    //Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
    return res.status(400).json({errores: errores.array() });
    }
  
    //Crear un objeto de enlace
    const {nombre_original} = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;
    enlace.descargas = 1;


    //Si el usuario esta autentificado
    if(req.usuario){
        const {password,descargas} = req.body;
        enlace.password = password;

        //Asignar a enlace el número de descargas
        if (descargas){
            enlace.descargas = descargas;
        }

        //Asignar un password
        if (password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        //Asignar el autor
        enlace.autor = req.usuario.id;
    }

    //Almacenar el enlace en la base de datos.
    try {
        await enlace.save();
        return res.json({msg: `${enlace.url}`})
    } catch (error) {
        console.log(error)
    }

}