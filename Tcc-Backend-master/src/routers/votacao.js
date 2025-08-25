import express from 'express';
import * as votacaoController from '../controllers/votacaoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarVotacao', votacaoController.PesquisarVotacoes)
router.get('/visualizarVotacao/:id', votacaoController.VisualizarVotacao)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Publicar Votacao'), votacaoController.CriarVotacao)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), votacaoController.AlterarVotacao)

router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), votacaoController.DeletarVotacao)

export default router;
