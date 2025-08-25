import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'
import * as validacaoComentario from '../validacoes/validacaoComentario.js'

export async function VisualizarComentario(req, res) {
    try {
        const data = { idComentario: Number(req.query.id) };

        const { idComentario } = validacaoComentario.SchemaVisualizarComentario.parse(data);

        const [resultado] = await db.query('CALL visualizarComentario(?)', [idComentario]);

        const comentarios = resultado[0] || [];

        if (comentarios.length === 0) return res.status(404).json({ message: 'Comentario não encontrado' });

        return res.status(200).json(comentarios);

    }catch (erro) {
        console.error('Erro ao pesquisar comentario: ', erro);
        return res.status(500).json({ error: 'Erro interno ao pesquisar comentario' });
  }
}

export async function CriarComentario(req,res) {
    try{
        const idUsuario = req.usuario.id;

        const  data = {
            texto: req.body.texto,
            idPauta: Number(req.body.idPauta)
        };

        const { texto, idPauta } = validacaoComentario.SchemaCriarComentario.parse(data);
      
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
    try{
        const idUsuario = req.usuario.id

        const data = {
            texto: req.body.texto,
            idComentario: Number(req.body.idComentario)
        };

        const { texto, idComentario } = validacaoComentario.SchemaAlterarComentario.parse(data);

        const [criadorComentario] = await db.query('SELECT id_usuario FROM Comentario WHERE id_comentario = ? AND id_usuario = ?', [idComentario,idUsuario])
        
        if(criadorComentario.length === 0 && req.usuario.cargo == 'cidadao') return res.status(403).json({ message: 'Você não pode alterar esse Comentario'})
        
        await db.query('UPDATE Comentario SET texto_comentario = ? WHERE id_comentario = ?', [texto, idComentario])
        
        await registrarAtividade('comentario_alterado', 'Comentário alterado', null, idUsuario)
        
        return res.status(200).json({ message: 'Comentario atualizado com sucesso'})

    }catch(erro){
        console.error('Erro ao atualizar Comentario: ',erro)
        return res.status(500).json({ error: 'Erro interno ao atualizar Comentario'})
    }
}

export async function DeletarComentario(req,res) {
    try{
        const idUsuario = req.usuario.id
        
        const data = {
            motivoRemocao: req.body.motivoRemocao,
            idComentario: Number(req.body.idComentario)
        };
        const { motivoRemocao, idComentario } = validacaoComentario.SchemaDeletarComentario.parse(data);

        const [criadorComentario] = await db.query('SELECT id_usuario FROM Comentario WHERE id_comentario = ? AND id_usuario = ?', [idComentario,idUsuario])
    
        if(criadorComentario.length === 0 && req.usuario.cargo == 'cidadao') return res.status(403).json({ message: 'Você não pode alterar essa Comentario'})

        await db.query('DELETE FROM Comentario WHERE id_comentario = ?', [idComentario])
   
        await registrarAtividade('comentario_removido', motivoRemocao, null, idUsuario)
    
        return res.status(200).json({ message: 'Comentario deletado com sucesso'})

    }catch(erro){
        console.error('Erro ao deletar Comentario: ',erro)
        return res.status(500).json({ error: 'Erro interno ao deletar Comentario'})
    }
}