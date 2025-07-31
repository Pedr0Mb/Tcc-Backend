import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function VisualizarComentario(req,res) {
  const {id} = req.query

  try{
    const [resultado] = await db.query('CALL visualizarComentario(?)', [id])
   
    const comentarios = resultado[0] || [];

    if (comentarios.length === 0) return res.status(404).json({ message: 'Comentario não encontrado' });
    
    return res.status(200).json(comentarios)

  }catch(erro){
    console.error('Erro ao pesquisar comentario: ',erro)
    return res.status(500).json({ error: 'Erro interno ao pesquisar comentario'})
  }
}

export async function CriarComentario(req,res) {
    const {texto, idPauta } = req.body
    const idUsuario = req.usuario.id

    try{
      await db.query(
        `INSERT INTO Comentario (
        texto_comentario,
        dataPublicacao_comentario,
        id_usuario,
        id_pauta ) 
        VALUES (?, NOW(), ?, ?)`,
        [texto, idUsuario, idPauta]
    );
    
        await registrarAtividade('comentario_criado', 'Comentário criado', null, idUsuario)
        
        return res.status(201).json({ message: 'Comentario criado com sucesso'})

    }catch(erro){
        console.error('Erro ao criar comentario: ',erro)
        return res.status(500).json({ error: 'Erro interno ao criar comentario'})
    }
}

export async function AlterarComentario(req,res) {
    const {idComentario,texto} = req.body
    const idUsuario = req.usuario.id

    if(!idComentario || !texto ) return res.status(400).json({ message: 'Preencha todos os campos'})

    const [criadorComentario] = await db.query('SELECT id_usuario FROM Comentario WHERE id_comentario = ? AND id_usuario = ?', [idComentario,idUsuario])

    if(criadorComentario.length === 0 && req.usuario.cargo == 'cidadao') return res.status(403).json({ message: 'Você não pode alterar esse Comentario'})

    try{
        await db.query('UPDATE Comentario SET texto_comentario = ? WHERE id_comentario = ?', [texto, idComentario])

        await registrarAtividade('comentario_alterado', 'Comentário alterado', null, idUsuario)

        return res.status(200).json({ message: 'Comentario atualizado com sucesso'})

    }catch(erro){
        console.error('Erro ao atualizar Comentario: ',erro)
        return res.status(500).json({ error: 'Erro interno ao atualizar Comentario'})
    }
}

export async function DeletarComentario(req,res) {
    const {idComentario,motivoRemocao} = req.body
    const idUsuario = req.usuario.id

    if(!idComentario) return res.status(400).json({message: 'Preencha todos os campos'})

    const [criadorComentario] = await db.query('SELECT id_usuario FROM Comentario WHERE id_comentario = ? AND id_usuario = ?', [idComentario,idUsuario])

    if(criadorComentario.length === 0 && req.usuario.cargo == 'cidadao') return res.status(403).json({ message: 'Você não pode alterar essa Comentario'})

     try{
        await db.query('DELETE FROM Comentario WHERE id_comentario = ?', [idComentario])

        await registrarAtividade('comentario_removido', motivoRemocao, null, idUsuario)

        return res.status(200).json({ message: 'Comentario deletado com sucesso'})

    }catch(erro){
        console.error('Erro ao deletar Comentario: ',erro)
        return res.status(500).json({ error: 'Erro interno ao deletar Comentario'})
    }
}