const Usuario = require ('../models/modeloUsuario')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
exports.nuevoUsuario = async (req, res) => {
    // console.log(req.body);


    //Mostrar mensaje de error de express-validator
    const errores = validationResult(req)
    if(!errores.isEmpty()){
      return res.status(400).json({errores: errores.array() });
    }
  
    try {
      const { email,password } = req.body;
  
      // Verificar si el usuario ya está registrado
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ msg: 'El usuario ya se encuentra registrado' });
      }
  
      // Crear y guardar el nuevo usuario
      const nuevoUsuario = new Usuario(req.body);
      const salt = await bcrypt.genSalt(10)
      nuevoUsuario.password = await bcrypt.hash(password,salt);
      await nuevoUsuario.save();
      res.json({ msg: 'Usuario creado correctamente' });


    } catch (error) {
      console.error(error);
  
      // Manejar el error de MongoDB (clave duplicada, etc.)
      if (error.code === 11000) {
        return res.status(400).json({ msg: 'Ya existe un usuario con este correo electrónico' });
      }
      res.status(500).json({ msg: 'Error del servidor al crear el usuario' });
    }
  };