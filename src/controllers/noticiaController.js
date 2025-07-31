import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function PesquisarNoticia(req,res) {
  const {titulo, tema, status} = req.query

  try{
    const [resultado] = await db.query('CALL pesquisarNoticias(?,?,?)', [titulo,tema,status])
   
    const noticias = resultado[0] || [];

    if (noticias.length === 0) return res.status(404).json({ message: 'Notícia não encontrada' });
    
    return res.status(200).json(noticias)

  }catch(erro){
    console.error('Erro ao pesquisar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao pesquisar noticia'})
  }
}

export async function VisualizarNoticia(req,res) {
  const id = req.params.id

  try{
    const [resultado] = await db.query('CALL visualizarNoticia(?)', [id])
    
    const noticia = resultado[0] || [];
   
    return res.status(200).json(noticia)

  }catch(erro){
    console.error('Erro ao visualizar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao visualizar o noticia'})
  }
}

export async function CriarNoticia(req,res) {
  const {titulo,tema,dataLimite, breveDescritivo, link, midia} = req.body
  const idGestor = req.usuario.id
      
  try{
   await db.query(
      `INSERT INTO Noticia (
      titulo_noticia,
      tema_noticia,
      dataPublicacao_noticia,
      dataLimite_noticia,
      status_noticia,
      breveDescritivo_noticia,
      link_noticia,
      midia_noticia,
      id_usuario ) 
      VALUES (?,?, NOW(), ?, 'Ativa', ?, ?, ?, ?)`,
      [titulo, tema, dataLimite, breveDescritivo, link, midia, idGestor]
  );
    
    await registrarAtividade('noticia_criada','Noticia criada',null,idGestor)
        
    return res.status(201).json({ message: 'Noticia criada com sucesso'})
        
  }catch(erro){
    console.error('Erro ao criar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao criar noticia'})
  }
}
    
export async function AlterarNoticia(req,res) {
  const {titulo,tema,dataLimite, status, breveDescritivo, link, midia} = req.body
  const idGestor = req.usuario.id
  
        
  try{
    await db.query(`UPDATE Noticia 
      SET titulo_noticia = ?, 
      tema_noticia = ?,
      dataLimite_noticia = ?,
      status_noticia = ?,
      breveDescritivo_noticia = ?,
      link_noticia = ?,
      midia_noticia = ?
      WHERE id_noticia = ?`
      , [titulo, tema, dataLimite, status, breveDescritivo, link, midia, idGestor]
    )
          
    await registrarAtividade('noticia_alterada','Noticia alterada',null,idGestor)
          
    return res.status(200).json({ message: 'Noticia atualizada com sucesso'})
          
    }catch(erro){
      console.error('Erro ao atualizar noticia: ',erro)
      return res.status(500).json({ error: 'Erro ao atualizar noticia'})
    }
}
      
export async function DeletarNoticia(req,res) {
  const {id,motivoRemocao} = req.body
  const idGestor = req.usuario.id

  try{
    await db.query('DELETE FROM Noticia WHERE id_noticia = ?', [id])

    await registrarAtividade('noticia_removida',motivoRemocao,null,idGestor)

    return res.status(200).json({ message: 'Noticia deletada com sucesso'})

  }catch(erro){
    console.error('Erro ao deletar noticia: ',erro)
    return res.status(500).json({ error: 'Erro ao deletar noticia'})
  }
}