import express from 'express';
import * as gestorController from '../controllers/gestorPublicoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarUsuario', autenticarToken, verificarPermissao('Administrador'), gestorController.PesquisarUsuario)
router.get('/visualizarUsuario/:id', autenticarToken, verificarPermissao('Administrador'), gestorController.VisualizarUsuario)

router.patch('/promoverUsuario/:id', autenticarToken, verificarPermissao('Administrador'), gestorController.PromoverUsuario)

export default router;
