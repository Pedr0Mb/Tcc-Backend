import express from 'express';
import * as noticiaController from '../controllers/noticiaController.js'
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { verificarPermissao } from '../middlewares/verificarPermissao.js';

const router = express.Router();

router.get('/pesquisarNoticia', noticiaController.PesquisarNoticia)
router.get('/visualizarNoticia/:id', noticiaController.VisualizarNoticia)

router.post('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Publicar Noticia'), noticiaController.CriarNoticia)

router.patch('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), noticiaController.AlterarNoticia)

router.delete('/', autenticarToken, verificarPermissao('GestorPublico','Administrador', 'Moderar Conteudo'), noticiaController.DeletarNoticia)

export default router;
