const express = require("express");
const router = express.Router();
const enlacesController = require("../controllers/enlacesController");
const archivosController = require("../controllers/archivosController");
const { check } = require("express-validator");
const auth = require("../middleware/middlewareAuth");

router.post(
  "/",
  auth,
  [
    check("nombre", "Sube un archivo ").not().isEmpty(),
    check("nombre_original", "Sube un archivo ").not().isEmpty(),
  ],
  enlacesController.nuevoEnlace
);

//Generando los enlaces staticos.
router.get("/",
  enlacesController.todosEnlaces
)

router.get('/:url',
  enlacesController.tienePassword,
  enlacesController.obtenerEnlance,
  // archivosController.eliminarArchivo
);

router.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlance,
)

module.exports = router;
