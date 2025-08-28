import express from 'express';
import * as comentarioController from '../controllers/comentarioController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.get('/visualizarComentario', comentarioController.visualizarComentario)

router.post('/', autenticarToken, comentarioController.criarComentario)

router.patch('/', autenticarToken, comentarioController.alterarComentario)

router.delete('/', autenticarToken, comentarioController.deletarComentario)

export default router;
