import express from 'express';
import * as userController from '../controllers/usuariosController.js';
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.post('/login', userController.LogarUsuario);
router.post('/', userController.criarUsuario);
router.get('/', autenticarToken, userController.VerMeuUsaurio)

export default router;
