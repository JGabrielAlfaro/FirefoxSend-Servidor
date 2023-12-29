const shortid = require("shortid");
const Enlaces = require("../models/modeloEnlace");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res, next) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Crear un objeto de enlace
  const { nombre_original,nombre } = req.body;
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre =nombre;
  enlace.nombre_original = nombre_original;
  enlace.descargas = 1;

  //Si el usuario esta autentificado
  if (req.usuario) {
    const { password, descargas } = req.body;
    enlace.password = password;

    //Asignar a enlace el número de descargas
    if (descargas) {
      enlace.descargas = descargas;
    }

    //Asignar un password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }

    //Asignar el autor
    enlace.autor = req.usuario.id;
  }

  //Almacenar el enlace en la base de datos.
  try {
    await enlace.save();
    return res.json({ msg: `${enlace.url}` });
  } catch (error) {
    console.log(error);
  }
};

//Obtener el enlace
exports.obtenerEnlance = async (req, res, next) => {
  // console.log(req.params.url)
  const { url } = req.params;

  //Verificar si existe el enlace
  // const enlace = await Enlaces.findOne({url: req.params.url})
  const enlace = await Enlaces.findOne({ url });
  if (!enlace) {
    res.status(404).json({ msg: "Ese enlace no existe" });
    return next();
  }

  //Si el enlace existe
  res.json({archivo: enlace.nombre });

  //si las descargas son igual a 1 - Borrar la entrada y borrar el archivo.
  const { descargas,nombre } = enlace;
  if (descargas === 1) {
    //Eliminar el archivo
    req.archivo = nombre;

    //Eliminar la entrada de la BD
     await Enlaces.findOneAndDelete(req.params.url)
    console.log("Eliminando:", req.params.url)

    next(); //se va al siguiente controlador

  } else {
    //Si las descargas son mayores a uno, restar uno.
    enlace.descargas--;
    await enlace.save();
  }
};
