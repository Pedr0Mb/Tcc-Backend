import express from 'express';
import * as propostaController from '../controllers/propostaController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/', propostaController.ListarProposta);
router.get('/pesquisarProposta', propostaController.PesquisarProposta)
router.get('/visualizarProposta/:id', propostaController.VisualizarProposta)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), propostaController.CriarProposta)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), propostaController.AlterarProposta)

router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), propostaController.DeletarProposta)

export default router;
