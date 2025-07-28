import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function ListarPauta(req,res) {
    try {
    const [pautas] = await db.query(`
      SELECT id_pauta,
      titulo_pauta,
      descricao_pauta,
      dataPublicacao_pauta,
      status_pauta
      FROM Pauta`
    )

    return res.status(200).json(pautas)

  } catch (erro) {
    console.error('Erro ao listar as pautas:', erro)
    return res.status(500).json({ error: 'Erro interno ao listar as pautas'})
  }
}

export async function PesquisarPauta(req,res) {
  const {id ,titulo} = req.query

  try{
    const [resultado] = await db.query('CALL pesquisarPautas(?,?)', [id,titulo])
   
    const pautas = resultado[0] || [];

    if (pautas.length === 0) return res.status(404).json({ message: 'pauta não encontrada' });
    
    return res.status(200).json(pautas)

  }catch(erro){
    console.error('Erro ao pesquisar pauta: ',erro)
    return res.status(500).json({ error: 'Erro interno ao pesquisar Pauta'})
  }
}

export async function VisualizarPauta(req, res) {
  const id = req.params.id;

  try {
    const [resultado] = await db.query('CALL visualizarPauta(?)', [id]);

    const pauta = resultado[0][0] || {}; 
    const comentarios = resultado[1] || []; 

    return res.status(200).json({pauta,comentarios});

  } catch (erro) {
    console.error('Erro ao visualizar pauta: ', erro);
    return res.status(500).json({ error: 'Erro interno ao visualizar a pauta' });
  }
}


export async function CriarPauta(req,res) {
    const {titulo, descricao, justificativa } = req.body
    const idUsuario = req.usuario.id

    if(!titulo || !descricao || !justificativa) return res.status(400).json({ message: 'Preencha todos os campos'})

    try{
        await db.query(
          `INSERT INTO Pauta (
          titulo_pauta,
          descricao_pauta,
          justificativa_pauta,
          dataPublicacao_pauta,
          status_pauta,
          id_usuario ) 
          VALUES (?, ?, ?, NOW(), 'Ativa', ?)`,
          [titulo, descricao, justificativa, idUsuario]
        );

        
        await registrarAtividade('pauta_criada', 'Pauta criada', null, idUsuario)
        
        return res.status(201).json({ message: 'Pauta criada com sucesso'})

    }catch(erro){
        console.error('Erro ao criar pauta: ',erro)
        return res.status(500).json({ error: 'Erro interno ao criar pauta'})
    }
}

export async function AlterarPauta(req,res) {
    const {id, titulo, descricao, justificativa, status } = req.body
    const idUsuario = req.usuario.id

    if(!id || !titulo || !descricao || !justificativa || !status) return res.status(400).json({ message: 'Preencha todos os campos'})

    const [criadorPauta] = await db.query(
      `SELECT id_usuario 
      FROM Pauta
      WHERE id_pauta = ? AND id_usuario = ?`, 
      [id, idUsuario]
    )

    if(criadorPauta.length === 0 && req.usuario.cargo == 'cidadao') return res.status(500).json({ message: 'Você não pode alterar essa pauta'})

    try{
        await db.query(
          `UPDATE Pauta 
          SET titulo_pauta = ?, 
          descricao_pauta = ?, 
          justificativa_pauta = ?, 
          status_pauta = ?
          WHERE id_pauta = ?`, 
          [titulo, descricao, justificativa, status, id]
        )
        
        await registrarAtividade('pauta_alterada', 'Pauta alterada', null, idUsuario)

        return res.status(200).json({ message: 'Pauta atualizada com sucesso'})

    }catch(erro){
        console.error('Erro ao atualizar Pauta: ',erro)
        return res.status(500).json({ error: 'Erro interno ao atualizar Pauta'})
    }
}

export async function DeletarPauta(req,res) {
    const {id,motivoRemocao} = req.body
    const idUsuario = req.usuario.id

    const [criadorPauta] = await db.query(`
      SELECT id_usuario 
      FROM Pauta WHERE id_pauta = ? AND id_usuario = ?`, [id, idUsuario])

    if(criadorPauta.length === 0 && req.usuario.cargo == 'cidadao') return res.status(500).json({ message: 'Você não pode alterar essa pauta'})

     try{
        await db.query('DELETE FROM Pauta WHERE id_pauta = ?', [id])
        
        await registrarAtividade('pauta_removida', motivoRemocao , null, idUsuario)

        return res.status(200).json({ message: 'Pauta deletada com sucesso'})

    }catch(erro){
        console.error('Erro ao atualizar Pauta: ',erro)
        return res.status(500).json({ error: 'Erro interno ao deletar Pauta'})
    }
}