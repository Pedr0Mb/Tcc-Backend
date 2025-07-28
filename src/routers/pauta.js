import express from 'express';
import * as pautaController from '../controllers/pautaController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.get('/', pautaController.ListarPauta);
router.get('/pesquisarPauta', pautaController.PesquisarPauta)
router.get('/visualizarPauta/:id', pautaController.VisualizarPauta)

router.post('/', autenticarToken, pautaController.CriarPauta)

router.patch('/', autenticarToken, pautaController.AlterarPauta)

router.delete('/', autenticarToken, pautaController.DeletarPauta)

export default router;
