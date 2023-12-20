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

router.get('/:url',
  enlacesController.obtenerEnlance,
  archivosController.eliminarArchivo
);

module.exports = router;
