import express from 'express';
import * as comentarioController from '../controllers/comentarioController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.get('/', comentarioController.ListarComentario);
router.get('/pesquisarComentario', comentarioController.PesquisarComentario)

router.post('/', autenticarToken, comentarioController.CriarComentario)

router.patch('/', autenticarToken, comentarioController.AlterarComentario)

router.delete('/', autenticarToken, comentarioController.DeletarComentario)

export default router;
