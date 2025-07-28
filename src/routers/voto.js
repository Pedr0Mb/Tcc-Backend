import express from 'express';
import * as votoController from '../controllers/votoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/',autenticarToken, verificarPermissao('GestorPublico','Administrador'), votoController.ListarVoto)
router.post('/', autenticarToken, votoController.RegistrarVoto)

export default router;
