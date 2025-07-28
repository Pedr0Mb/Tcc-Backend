import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function ListarProposta(req,res) {
 const { idVotacao } = req.query

    try{
        const [proposta] = await db.query(
          `SELECT titulo_proposta, 
          descricao_proposta, 
          criador_proposta, 
          qtVotos_proposta 
          FROM Proposta
          WHERE id_votacao = ?
          `, [idVotacao]
        )
        
        return res.status(200).json(proposta)
    }catch(erro){
        console.error('Erro ao listar as propostas:', erro)
        res.status(500).json({ error: 'Erro interno ao listar propostas'})
    }
}

export async function PesquisarProposta(req,res) {
  const {tituloProposta ,idVotacao} = req.query

  try{
    const [resultado] = await db.query('CALL pesquisarPropostas(?,?)', [tituloProposta,idVotacao])
   
    const propostas = resultado[0] || [];

    if (propostas.length === 0) return res.status(404).json({ message: 'Proposta não encontrada' });
    
    return res.status(200).json(propostas)

  }catch(erro){
    console.error('Erro ao pesquisar proposta: ',erro)
    return res.status(500).json({ error: 'Erro ao pesquisar proposta'})
  }
}

export async function VisualizarProposta(req,res) {
  const id = req.params.id

  try{
    const [resultado] = await db.query('CALL visualizarProposta(?)', [id])
    
    const proposta = resultado[0] || [];
   
    return res.status(200).json(proposta)

  }catch(erro){
    console.error('Erro ao visualizar proposta: ',erro)
    return res.status(500).json({ error: 'Erro ao visualizar o proposta'})
  }
}

export async function CriarProposta(req,res) {
  const {titulo, descricao, criador,idVotacao} = req.body
  const idGestor = req.usuario.id
    
  if(!titulo || !descricao || !criador ) return res.status(400).json({ message: 'Preencha todos os campos'})
      
  try{
    await db.query(
      `INSERT INTO Proposta (
      titulo_proposta,
      descricao_proposta,
      criador_proposta,
      id_votacao,
      id_usuario )
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, descricao, criador, idVotacao, idGestor]
    );

    await registrarAtividade('proposta_criada','Proposta criada',null,idGestor)
        
    return res.status(201).json({ message: 'Proposta criada com sucesso'})
        
  }catch(erro){
    console.error('Erro ao criar proposta: ',erro)
    return res.status(500).json({ error: 'Erro ao criar proposta'})
  }
}
    
export async function AlterarProposta(req,res) {
  const {id,titulo, descricao, criador, qtVotos} = req.body
  const idGestor = req.usuario.id
      
  if(!id ||!titulo || !descricao || !criador || !qtVotos) return res.status(400).json({ message: 'Preencha todos os campos'})
        
  try{
    await db.query(`
      UPDATE Proposta
      SET titulo_proposta = ?, 
      descricao_proposta = ?, 
      criador_proposta = ?, 
      qtVotos_proposta = ? 
      WHERE id_proposta = ?`, 
      [titulo,descricao,criador,qtVotos,id]
    )
          
    await registrarAtividade('proposta_alterada','Proposta alterada',null,idGestor)
          
    return res.status(200).json({ message: 'Proposta atualizada com sucesso'})
          
    }catch(erro){
      console.error('Erro ao atualizar proposta: ',erro)
      return res.status(500).json({ error: 'Erro ao atualizar proposta'})
    }
}
    
export async function DeletarProposta(req,res) {
  const {id,motivoRemocao} = req.body
  const idGestor = req.usuario.id

  try{
    await db.query('DELETE FROM Proposta WHERE id_proposta = ?', [id])

    await registrarAtividade('proposta_removida',motivoRemocao,null,idGestor)

    return res.status(200).json({ message: 'Proposta deletada com sucesso'})

  }catch(erro){
    console.error('Erro ao deletar proposta: ',erro)
    return res.status(500).json({ error: 'Erro ao deletar proposta'})
  }
}