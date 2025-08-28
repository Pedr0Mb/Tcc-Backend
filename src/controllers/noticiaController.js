import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoNoticia from '../validacoes/validacaoNoticia.js'

export async function pesquisarNoticia(req,res) {
  try{
    const data = {
      titulo: req.query.titulo || null,
      tema: req.query.tema || null,
      status: req.query.status || null
    }

    const { titulo, tema, status } = validacaoNoticia.SchemaPesquisarNoticia.parse(data)
    
    const [resultado] = await db.query('CALL pesquisarNoticias(?,?,?)', [titulo,tema,status])
   
    const noticias = resultado[0] || [];

    if (noticias.length === 0) return res.status(404).json({ message: 'Notícia não encontrada' });
    
    return res.status(200).json(noticias)

  }catch(erro){
    console.error('Erro ao pesquisar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao pesquisar noticia'})
  }
}

export async function visualizarNoticia(req,res) {
  try{
    const data = { idNoticia: Number(req.params.id) }

    const { idNoticia } = validacaoNoticia.SchemaVisualizarNoticia.parse(data);

    const [resultado] = await db.query('CALL visualizarNoticia(?)', [idNoticia])
    
    const noticia = resultado[0] || [];
   
    return res.status(200).json(noticia)

  }catch(erro){
    console.error('Erro ao visualizar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao visualizar o noticia'})
  }
}

export async function criarNoticia(req,res) {
  try{
  const idGestor = req.usuario.id
   
  const data = {
    titulo: req.body.titulo,
    tema: req.body.tema,
    dataLimite: new Date(req.body.dataLimite),
    breveDescritivo: req.body.breveDescritivo,
    link: req.body.link,
    imagem: req.body.imagem
  }

  const { titulo, tema, dataLimite, breveDescritivo, link, imagem } = validacaoNoticia.SchemaCriarNoticia.parse(data);
  
  await db.query(
      `INSERT INTO Noticia (
      titulo_noticia,
      tema_noticia,
      dataPublicacao_noticia,
      dataLimite_noticia,
      status_noticia,
      breveDescritivo_noticia,
      link_noticia,
      imagem_noticia,
      id_usuario ) 
      VALUES (?,?, NOW(), ?, 'Ativa', ?, ?, ?, ?)`,
      [titulo, tema, dataLimite, breveDescritivo, link, imagem, idGestor]
  );
    
    await registrarAtividade('noticia_criada','Noticia criada',null,idGestor)
        
    return res.status(201).json({ message: 'Noticia criada com sucesso'})
        
  }catch(erro){
    console.error('Erro ao criar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao criar noticia'})
  }
}
    
export async function alterarNoticia(req,res) {
  try{
    const idGestor = req.usuario.id
    
    const data = {
      idNoticia: Number(req.body.idNoticia),
      titulo: req.body.titulo,
      tema: req.body.tema,
      dataLimite: new Date(req.body.dataLimite),
      status: req.body.status,
      breveDescritivo: req.body.breveDescritivo,
      link: req.body.link,
      imagem: req.body.imagem
    }

    const { idNoticia, titulo, tema, dataLimite, status, breveDescritivo, link, imagem } = validacaoNoticia.SchemaAlterarNoticia.parse(data);

    await db.query(`UPDATE Noticia 
      SET titulo_noticia = ?, 
      tema_noticia = ?,
      dataLimite_noticia = ?,
      status_noticia = ?,
      breveDescritivo_noticia = ?,
      link_noticia = ?,
      imagem_noticia = ?
      WHERE id_noticia = ?`
      , [titulo, tema, dataLimite, status, breveDescritivo, link, imagem, idNoticia]
    )
          
    await registrarAtividade('noticia_alterada','Noticia alterada',null,idGestor)
          
    return res.status(200).json({ message: 'Noticia atualizada com sucesso'})
          
    }catch(erro){
      console.error('Erro ao atualizar noticia: ',erro)
      return res.status(500).json({ error: 'Erro ao atualizar noticia'})
    }
}
      
export async function deletarNoticia(req,res) {
  try{
    const idGestor = req.usuario.id

    const data = { 
      idNoticia: Number(req.params.id), 
      motivoRemocao: req.body.motivoRemocao 
    };

    const { idNoticia, motivoRemocao } = validacaoNoticia.SchemaDeletarNoticia.parse(data);

    await db.query('DELETE FROM Noticia WHERE id_noticia = ?', [idNoticia])

    await registrarAtividade('noticia_removida',motivoRemocao,null,idGestor)

    return res.status(200).json({ message: 'Noticia deletada com sucesso'})

  }catch(erro){
    console.error('Erro ao deletar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao deletar noticia'})
  }
}