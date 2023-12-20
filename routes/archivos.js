const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController')
const auth = require('../middleware/middlewareAuth')


// //Subida de archivos
// const multer = require('multer')
// const upload = multer({ dest: './uploads/'})

router.post('/',
    // upload.single('archivo'),
    auth,
    archivosController.subirArchivo
)

//No se llama directamente, por lo que se comenta.
// router.delete('/:id',
//     archivosController.eliminarArchivo
// )

module.exports = router;