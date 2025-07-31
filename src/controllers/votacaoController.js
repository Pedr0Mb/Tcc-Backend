import { db } from '../plugins/bd.js'
import { registrarAtividade } from '../utils/registroAtividade.js'

export async function PesquisarVotacoes(req,res) {
  const {titulo ,status, tema} = req.query

  try{
    const [resultado] = await db.query('CALL pesquisarVotacoes(?,?,?)', [status, titulo,tema])
   
    const votacoes = resultado[0] || [];

    if (votacoes.length === 0) return res.status(404).json({ message: 'Votação não encontrada' });
    
    return res.status(200).json(votacoes)

  }catch(erro){
    console.error('Erro ao pesquisar votação: ',erro)
    return res.status(500).json({ error: 'Erro ao pesquisar votação'})
  }
}

export async function VisualizarVotacao(req, res) {
  const id = req.params.id;

  try {
    const [resultado] = await db.query('CALL visualizarVotacao(?)', [id]);

    const votacao = resultado[0] || {};     
    const propostas = resultado[1] || [];     

    return res.status(200).json({votacao,propostas});

  } catch (erro) {
    console.error('Erro ao visualizar votação: ', erro);
    return res.status(500).json({ error: 'Erro interno ao visualizar a votação' });
  }
}


export async function CriarVotacao(req,res) {
  const {titulo, tema, breveDescritivo,publicoAlvo,orcamento, dataFim, anexos, resultado, opcoesResposta} = req.body
  const idGestor = req.usuario.id
      
  try{
   const [resultadoVotacao] = await db.execute(
      `INSERT INTO Votacao (
      titulo_votacao,
      tema_votacao,
      breveDescritivo_votacao,
      publicoAlvo_votacao,
      orçamento_votacao,
      dataPublicação_votacao,
      dataFim_votacao,
      status_votacao,
      anexos_votacao,
      resultado_votacao,
      id_usuario )
      VALUES (?, ?, ?, ?, ?, 'NOW()', ?, 'Ativa', ?, ?, ?)`,
      [titulo,tema, breveDescritivo,publicoAlvo,orcamento, dataFim, anexos, resultado, idGestor]
    )

    const idVotacao = resultadoVotacao.id_votacao
     
     for (const opcoes of opcoesResposta) {
      await db.query(`
        INSERT INTO OpcoesResposta (
        titulo_opcaoResposta, 
        id_votacao,
        id_usuario)
        VALUES (?,?,?)
      `,[opcoes,idVotacao,idGestor])
     }

    await registrarAtividade('votacao_criada','Votação criada',null,idGestor)
        
    return res.status(201).json({ message: 'Votação criada com sucesso'})
        
  }catch(erro){
    console.error('Erro ao criar votação: ',erro)
    return res.status(500).json({ error: 'Erro ao criar votação'})
  }
}
    
export async function AlterarVotacao(req,res) {
  const {idVotacao, titulo, tema, breveDescritivo,publicoAlvo,orcamento, dataFim, status, anexos, resultado} = req.body
  const idGestor = req.usuario.id
        
  try{
    await db.query(
      `UPDATE Votacao 
      SET titulo_votacao = ?, 
      tema_votacao = ?,
      breveDescritivo_votacao = ?,
      publicoAlvo_votacao = ?
      orçamento_votacao = ?,
      dataFim_votacao = ?,
      status_votacao = ?,
      anexos_votacao = ?,
      resultado_votacao = ?,
      WHERE id_votacao = ?`, 
      [titulo,tema, breveDescritivo,publicoAlvo,orcamento, dataFim, status, anexos, resultado, idVotacao]
    )
          
    await registrarAtividade('votacao_alterada','Votação alterada',null,idGestor)
          
    return res.status(200).json({ message: 'Votação atualizada com sucesso'})
          
    }catch(erro){
      console.error('Erro ao atualizar votação: ',erro)
      return res.status(500).json({ error: 'Erro ao atualizar votação'})
    }
}
    
export async function DeletarVotacao(req,res) {
  const {id,motivoRemocao} = req.body
  const idGestor = req.usuario.id

  try{
    await db.query('DELETE FROM Votacao WHERE id_votacao = ?', [id])

    await registrarAtividade('votacao_removida',motivoRemocao,null,idGestor)

    return res.status(200).json({ message: 'Votação deletada com sucesso'})

  }catch(erro){
    console.error('Erro ao deletar votação: ',erro)
    return res.status(500).json({ error: 'Erro ao deletar votação'})
  }
}