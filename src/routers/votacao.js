import express from 'express';
import * as votacaoController from '../controllers/votacaoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/', votacaoController.ListarVotacoes);
router.get('/pesquisarVotacao', votacaoController.PesquisarVotacoes)
router.get('/visualizarVotacao/:id', votacaoController.VisualizarVotacao)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), votacaoController.CriarVotacao)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), votacaoController.AlterarVotacao)

router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), votacaoController.DeletarVotacao)

export default router;
