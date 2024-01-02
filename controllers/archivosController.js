const multer = require("multer");
const shortid = require("shortid");
const fs = require('fs')
const Enlaces = require('../models/modeloEnlace')

exports.subirArchivo = async (req, res, next) => {
  const configMulter = {
    limits: { fileSize: req.usuario ? 1024 * 2024 * 10 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        // const extension = file.mimetype.split("/")[1];
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.',file.originalname.length))
        cb(null, `${shortid.generate()}${extension}`);
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf") {
          return cb(null, true);
        }
      },
    })),
  };
  const upload = multer(configMulter).single("archivo");

  upload(req, res, async (error) => {
    console.log(req.file);
    if (!error) {
      res.json({ archivo: req.file.filename });
      return next();
    } else {
      console.log(error);
      res.status(401).json({msg:"Ocurrio un error al cargar el archivo"})
    }
  });
};

exports.eliminarArchivo = async (req, res) => {
    console.log("Nombre de archivo: ", req.archivo)
    try {
        //  fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
         fs.unlinkSync(`uploads/${req.archivo}`)
        console.log(!"Ruta del archivo eliminado:", `${__dirname} + /../uploads/${req.archivo}`)
    } catch (error) {
        console.log("Error al eliminar el archivo")
    }

};

//Descarga un archivo
exports.descargar = async (req, res,next) => {
  //Obtiene el enlace
  const {archivo} = req.params;
  const enlace = await Enlaces.findOne({nombre: archivo})

  const archivoDescarga = __dirname + '/../uploads/' + archivo;
  res.download(archivoDescarga);

  //Eliminar el archivo y la entrada de la base de datos.
  //si las descargas son igual a 1 - Borrar la entrada y borrar el archivo.
  const { descargas,nombre } = enlace;
  if (descargas === 1) {
    //Eliminar el archivo
    req.archivo = nombre;

    //Eliminar la entrada de la BD
     await Enlaces.findOneAndDelete(enlace.id)
    next(); //se va al siguiente controlador

  } else {
    //Si las descargas son mayores a uno, restar uno.
    enlace.descargas--;
    await enlace.save();
  }

};