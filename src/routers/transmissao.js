import express from 'express';
import * as transmissaoController from '../controllers/transmissaoController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/', transmissaoController.ListarTransmissoes);
router.get('/pesquisarTransmissao', transmissaoController.PesquisarTransmissao)
router.get('/visualizarTransmissao/:id', transmissaoController.VisualizarTransmissao)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), transmissaoController.CriarTransmissao)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), transmissaoController.AlterarTransmissao)

router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador'), transmissaoController.DeletarTransmissao)

export default router;
