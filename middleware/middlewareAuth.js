
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'.env'})


module.exports = (req,res,next) => {
    const autHeader = req.get('Authorization')
    if (autHeader){
        //Obtener el token
        const token = autHeader.split(' ')[1]; // Obtenemos la posicion 1, porque viene como "Bearer token_xadfafdfa"

        //Comprobar el JWT
        try {
            const usuario = jwt.verify(token,process.env.SECRETA)
            // res.json({usuario})
            
            req.usuario = usuario; //inyectamos la salida generada json del id,nombre, email, iat,exp
            
        } catch (error) {
            // console.log(error)
            console.log("JWT no valido")
        }
       
    }

    return next(); // Vaya al siguiente Middleware
}

