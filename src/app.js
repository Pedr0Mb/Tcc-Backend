import express from 'express'
import usuariosRoutes from './routers/usuario.js'
import gestorRoutes from './routers/gestorPublico.js'
import noticiaRoutes from './routers/noticias.js'
import transmissaoRoutes from './routers/transmissao.js'
import pautaRoutes from './routers/pauta.js'
import comentarioRoutes from './routers/comentario.js'
import votacaoRoutes from './routers/votacao.js'
import propostaRoutes from './routers/proposta.js'
import votoRoutes from './routers/voto.js'


const app = express()

app.use(express.json())

app.use('/usuario', usuariosRoutes);
app.use('/gestor', gestorRoutes);
app.use('/noticias', noticiaRoutes)
app.use('/transmissao', transmissaoRoutes)
app.use('/pauta', pautaRoutes)
app.use('/comentario', comentarioRoutes)
app.use('/votacao', votacaoRoutes)
app.use('/proposta', propostaRoutes)
app.use('/voto', votoRoutes)

export default app