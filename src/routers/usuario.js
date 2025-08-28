import express from 'express';
import * as userController from '../controllers/usuariosController.js';
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.post('/login', userController.logarUsuario);
router.post('/', userController.criarUsuario);
router.get('/', autenticarToken, userController.verMeuUsaurio)

export default router;
